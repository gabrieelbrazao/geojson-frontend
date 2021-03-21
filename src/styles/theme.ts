import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#F50057'
    },
    secondary: {
      main: '#FFFFFF'
    },
    background: {
      default: '#121214'
    }
  },
  typography: {
    h3: {
      fontWeight: 'bold',
      color: '#F50057'
    },
    body2: {
      fontWeight: 'bold',
      color: '#F50057',
      fontSize: '1rem'
    }
  }
})

export default theme
