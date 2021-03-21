import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@material-ui/core'
import { Dispatch, forwardRef, Ref, SetStateAction } from 'react'
import { TransitionProps } from '@material-ui/core/transitions/transition'
import { useRouter } from 'next/router'

interface Iprops {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const SuccessModal: React.FC<Iprops> = ({ openDialog, setOpenDialog }) => {
  const router = useRouter()

  return (
    <>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
        disableBackdropClick
      >
        <DialogTitle id="alert-dialog-slide-title">Sucesso!</DialogTitle>

        <DialogContent>
          <DialogContentText>Cadastro efetuado com sucesso.</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => router.push('/signin')} color="primary">
            Tela de login
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SuccessModal
