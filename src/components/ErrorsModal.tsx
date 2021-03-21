import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Slide
} from '@material-ui/core'
import { Dispatch, forwardRef, Ref, SetStateAction } from 'react'
import { TransitionProps } from '@material-ui/core/transitions/transition'

interface Iprops {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  errors: string[]
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const ErrorsModal: React.FC<Iprops> = ({
  openDialog,
  setOpenDialog,
  errors
}) => {
  return (
    <>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle id="alert-dialog-slide-title">
          Alguns erros foram encontrados!
        </DialogTitle>

        <DialogContent>
          <List>
            {errors?.map((error, index) => (
              <ListItem button key={index}>
                <ListItemText primary={error}></ListItemText>
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ErrorsModal
