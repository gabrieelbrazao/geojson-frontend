import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  TextField
} from '@material-ui/core'
import { Dispatch, forwardRef, Ref, SetStateAction } from 'react'
import { TransitionProps } from '@material-ui/core/transitions/transition'

interface Iprops {
  openDialog: boolean
  setOpenDialog: Dispatch<SetStateAction<boolean>>
  createFeature: ({ layer, layerType }) => void
  layerData
  setGeomName
  geomName
  setGeomColor
  geomColor
  cancelFeature
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const NewFeatureModal: React.FC<Iprops> = ({
  openDialog,
  setOpenDialog,
  createFeature,
  layerData,
  setGeomName,
  geomName,
  setGeomColor,
  geomColor,
  cancelFeature
}) => {
  return (
    <>
      <Dialog
        open={openDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenDialog(false)}
        disableBackdropClick
      >
        <DialogTitle id="alert-dialog-slide-title">
          Finalizando criação
        </DialogTitle>

        <DialogContent>
          <TextField
            label="Nome"
            variant="outlined"
            onChange={event => setGeomName(event.target.value)}
            style={{ marginBottom: 24, width: '100%' }}
            value={geomName}
          />

          <TextField
            variant="outlined"
            onChange={event => setGeomColor(event.target.value)}
            style={{ width: '100%' }}
            type="color"
            value={geomColor}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => cancelFeature()} color="default">
            Cancelar
          </Button>

          <Button onClick={() => createFeature(layerData)} color="primary">
            Finalizar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default NewFeatureModal
