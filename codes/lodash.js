let _ = require('lodash');
let array = [1, 1,
    {"category_id": 42, "text": "foo"},
    {"category_id": 42, "text": "FOo"},
]
// pour distinguer les nombres des objets
const [nombres, autres] = _.partition(array, Number.isInteger);
// pour obtenir une liste d'éléments distinct
const nombres_distints = _.uniqWith(nombres, _.isEqual)
// pour avoir une copie identique d'éléments contenus dans un tableau
const autres_bis = _.clonedeep(autres);
// etc...