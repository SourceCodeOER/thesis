try {
    const response: SearchExerciseResponse = await this.app.$axios.$post('/api/search', newSearchRequest);
    commit('INIT', response);
  } catch (e) {
    const errorAxios = e as AxiosError;
    const status : number = (errorAxios.response) ? errorAxios.response.status : 400;
    const errors : any = {
      400: "Une erreur est survenue lors du chargement des exercices.",
      401: `Vous devez vous connecter pour charger ces exercices.`,
      403: `Vous n'êtes pas autorisé à effectuer cette action.`,
      500: `Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`,
    }

    // fetch the message for this error
    const message : string = (errors.hasOwnProperty(status)) ? errors[status] : errors[400];
    this.$displayError(message, {statusCode: status});
  
    commit('RESET')
}