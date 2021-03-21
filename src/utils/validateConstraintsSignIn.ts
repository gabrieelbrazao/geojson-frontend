export default {
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
    }
  }
}
