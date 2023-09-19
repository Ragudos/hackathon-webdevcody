import React from "react";


type Props = {
  noteTitle: string,
  noteDescription: string
}

const MetadataEditor: React.FC<Props> = React.memo(
  ({ noteDescription, noteTitle }) => {
    const [title, setTitle] = React.useState(noteTitle);
    const [description, setDescription] = React.useState(noteDescription);
    
    return (
      <React.Fragment>
        
      </React.Fragment>
    );
  }
);