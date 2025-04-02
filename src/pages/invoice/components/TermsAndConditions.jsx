import React from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const TermsAndConditions = ({ terms, onTermsChange }) => {
  const [newTerm, setNewTerm] = React.useState("");

  const handleAddTerm = () => {
    if (newTerm.trim()) {
      onTermsChange([...terms, newTerm.trim()]);
      setNewTerm("");
    }
  };

  const handleDeleteTerm = (index) => {
    const updatedTerms = terms.filter((_, i) => i !== index);
    onTermsChange(updatedTerms);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && newTerm.trim()) {
      handleAddTerm();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Terms & Conditions
      </Typography>

      <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          size="small"
          value={newTerm}
          onChange={(e) => setNewTerm(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a new term or condition"
          variant="outlined"
          className="dark:text-white"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTerm}
          disabled={!newTerm.trim()}
          startIcon={<AddIcon />}
        >
          Add
        </Button>
      </Box>

      <List
        sx={{ bgcolor: "background.paper" }}
        className="dark:bg-gray-800 bg-gray-200"
      >
        {terms.map((term, index) => (
          <ListItem
            key={index}
            sx={{
              borderRadius: 1,
              mb: 1,
              bgcolor: "background.paper",
              // bgcolor: '#f5f5f5',
              // '&:hover': { bgcolor: '#eeeeee' }
            }}
            className="dark:bg-gray-700 bg-white"
          >
            <ListItemText
              primary={`${index + 1}. ${term}`}
              sx={{ pr: 2 }}
              className="dark:text-white text-gray-700"
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => handleDeleteTerm(index)}
                size="small"
                className="dark:text-white"
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {terms.length === 0 && (
        <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
          No terms and conditions added yet
        </Typography>
      )}
    </Box>
  );
};

export default TermsAndConditions;
