import React, { useContext, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import AddAPhotoIcon from "@material-ui/icons/AddAPhotoTwoTone";
import LandscapeIcon from "@material-ui/icons/LandscapeOutlined";
import ClearIcon from "@material-ui/icons/Clear";
import SaveIcon from "@material-ui/icons/SaveTwoTone";
import Context from "../../context";
import { CREATE_PIN_MUTATION } from "../../graphql/mutations";
import {useClient} from "../../client";


const CreatePin = ({ classes }) => {
  const client = useClient()
  const { state, dispatch } = useContext(Context);
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageUpload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "geopins");
    data.append("cloud_name", "inphoenix");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/inphoenix/image/upload",
      data
    );
    console.log("%c res.data", "background: red", res.data.url)
    return res.data.url;
  };

  const handleDeleteDraft = () => {
    setTitle("");
    setImage("");
    setContent("");
    dispatch({ type: "DELETE_DRAFT" });
  };

  const handleSubmit = async event => {
    try {
      event.preventDefault();
      setSubmitting(true);
      const url = await handleImageUpload();
      const { latitude, longitude } = state.draft;

      const variables = {
        title,
        image: url,
        content,
        latitude,
        longitude
      };

      const { createPin } = await client.request(
        CREATE_PIN_MUTATION,
        variables
      );
      dispatch({type: 'CREATE_PIN', payload: createPin})
      handleDeleteDraft()
    } catch (err) {
      setSubmitting(false);
      console.error("%c err", "background: red", err);
    }
  };

  return (
    <form className={classes.form}>
      <Typography
        className={classes.alignCenter}
        component={"h2"}
        variant={"h4"}
        color={"secondary"}
      >
        <LandscapeIcon className={classes.iconLarge}>
          Pin Location
        </LandscapeIcon>
      </Typography>
      <div>
        <TextField
          name="title"
          label="title"
          placeholder="insert pin title"
          onChange={e => setTitle(e.target.value)}
        />
        <input
          accept={"image/*"}
          id={"image"}
          type={"file"}
          className={classes.input}
          onChange={e => setImage(e.target.files[0])}
        />
        <label htmlFor={"image"}>
          <Button
            style={{ color: image && "green" }}
            component={"span"}
            size={"small"}
            className={classes.button}
          >
            <AddAPhotoIcon />
          </Button>
        </label>
      </div>
      <div className={classes.contentField}>
        <TextField
          name={"content"}
          label={"content"}
          multiline
          rows={"6"}
          margin={"normal"}
          fullWidth
          variant={"outlined"}
          onChange={e => setContent(e.target.value)}
        />
      </div>

      <div>
        <Button
          onClick={handleDeleteDraft}
          className={classes.button}
          variant={"contained"}
          color={"primary"}
        >
          <ClearIcon className={classes.leftIcon} />
          Discard
        </Button>
        <Button
          disabled={!title.trim() || !content.trim() || submitting}
          onClick={handleSubmit}
          className={classes.button}
          variant={"contained"}
          color={"secondary"}
        >
          <SaveIcon className={classes.rightIcon} />
          Submit
        </Button>
      </div>
    </form>
  );
};

const styles = theme => ({
  form: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    paddingBottom: theme.spacing.unit
  },
  contentField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: "95%"
  },
  input: {
    display: "none"
  },
  alignCenter: {
    display: "flex",
    alignItems: "center"
  },
  iconLarge: {
    fontSize: 40,
    marginRight: theme.spacing.unit
  },
  leftIcon: {
    fontSize: 20,
    marginRight: theme.spacing.unit
  },
  rightIcon: {
    fontSize: 20,
    marginLeft: theme.spacing.unit
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    marginLeft: 0
  }
});

export default withStyles(styles)(CreatePin);
