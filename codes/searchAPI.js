// Extracted from models/Exercises (it should be renamed to "Fiche" one day)
// The interesting method is tagsConditionsBuilder
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const simpleCase = (array, mustBePresent) => {
    // positive tags : 2 OR 3 OR 4 , etc...
    // negative tags : NOT 2 OR NOT 3 , etc...
    return Sequelize.where(
        // for negative check, we should use contains instead
        // For example (using the examples above) :
        //   For positive check : tags_ids && [2,3,4]
        //   For negative check : tags_ids @> [2,3]
        Sequelize.where(
            Sequelize.col("tags_ids"),
            (mustBePresent) ? Op.overlap : Op.contains,
            array
        ),
        Op.is,
        mustBePresent
    )
};

const tagsWhereBuilder = {
    "simpleCase": simpleCase,
    "complexCase": (must_have, must_not) => ({
        [Op.or]: [
            simpleCase(must_have, true),
            simpleCase(must_not, false),
        ]
    })
};

// tag condition builder 
function tagsConditionsBuilder(tags) {

    const conditions = tags.map(tagOrTags => {

        // filter negative/positive integer(s) into array ( more efficient to check that way )
        const must_have = Array.isArray(tagOrTags)
            ? tagOrTags.filter(tag => tag >= 0)
            : tagOrTags >= 0
                ? [tagOrTags]
                : [];
        const must_not = Array.isArray(tagOrTags)
            ? tagOrTags.filter(tag => !(tag >= 0)).map(tag => -tag)
            : tagOrTags >= 0
                ? []
                : [-tagOrTags];

        // multiple case can occur because of the mixin of must_have / must_not checks
        // One is these case is mandatory true
        const kind = (must_not.length > 0 && must_have.length > 0) ? "complexCase" : "simpleCase";

        // in simple case, it's straightforward
        if (kind === "simpleCase") {
            return tagsWhereBuilder[kind](
                (must_have.length > 0) ? must_have : must_not,
                // simplification : if must_have is not empty, mustOverlap will be true , otherwise false (must_not)
                must_have.length > 0
            )
        } else {
            // the most horrible case
            return tagsWhereBuilder[kind](must_have, must_not)
        }

    });

    // as the expression is in Conjunctive Normal Form, we know we can combine AND and OR formulas
    return {
        [Op.and]: conditions
    };
}