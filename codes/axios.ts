try {
    const response: SearchExerciseResponse = await this.app.$axios.$post('/api/search', newSearchRequest);
    commit('INIT', response);
  } catch (e) {
    const errorAxios = e as AxiosError;
  
    if (errorAxios.response) {
      const status: number = errorAxios.response.status;
  
      if (status === 400) {
        this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
      } else if (status === 401) {
        this.$displayError(`Vous devez vous connecter pour charger ces exercices.`, {statusCode: status});
      } else if (status === 403) {
        this.$displayError(`Vous n'êtes pas autorisé à effectuer cette action.`, {statusCode: status});
      } else if (status === 500) {
        this.$displayError(`Une erreur est survenue depuis nos serveurs, veuillez-nous en excuser.`, {statusCode: status});
      } else {
        this.$displayError("Une erreur est survenue lors du chargement des exercices.", {statusCode: status});
      }
    } else {
        this.$displayError(`Une erreur est survenue lors du chargement des exercices.`, {statusCode: 400});
    }
  
    commit('RESET')
  }