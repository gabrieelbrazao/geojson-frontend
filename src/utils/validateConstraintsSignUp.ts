export default {
  name: {
    presence: {
      allowEmpty: false,
      message: 'Nome não pode estar em branco.'
    },
    length: {
      minimum: 3,
      message: 'Nome deve possuir pelo menos 3 caracteres.'
    }
  },
  email: {
    presence: {
      allowEmpty: false,
      message: 'E-mail não pode estar em branco.'
    },
    email: {
      message: 'E-mail não pode estar inválido.'
    }
  },
  password: {
    presence: {
      allowEmpty: false,
      message: 'Senha não pode estar em branco.'
    },
    length: {
      minimum: 8,
      message: 'Senha deve possuir pelo menos 8 caracteres.'
    }
  }
}
