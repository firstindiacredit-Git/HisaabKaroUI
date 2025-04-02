import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  InputAdornment,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ItemsTable = ({
  items,
  currency,
  onItemChange,
  onItemRemove,
  onAddItem,
}) => {
  return (
    <div className="border border-transparent dark:bg-gray-800 dark:border-gray-800 rounded p-6 bg-white">
      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table>
          <TableHead className="dark:bg-gray-700 bg-gray-200 dark:text-white">
            <TableRow>
              <TableCell className="dark:text-white" align="center" width="50">
                #
              </TableCell>
              <TableCell className="dark:text-white">Description</TableCell>
              <TableCell className="dark:text-white" align="right" width="100">
                Quantity
              </TableCell>
              <TableCell className="dark:text-white" align="right" width="150">
                Price
              </TableCell>
              <TableCell className="dark:text-white" align="right" width="150">
                Total
              </TableCell>
              <TableCell className="dark:text-white" align="center" width="70">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="dark:bg-gray-600 bg-gray-100 dark:text-white">
            {items.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="dark:text-white" align="center">
                  {index + 1}
                </TableCell>
                <TableCell className="dark:text-white">
                  <TextField
                    fullWidth
                    variant="standard"
                    value={item.description}
                    onChange={(e) =>
                      onItemChange(index, {
                        ...item,
                        description: e.target.value,
                      })
                    }
                    placeholder="Item description"
                    className="dark:text-white"
                  />
                </TableCell>
                <TableCell className="dark:text-white" align="right">
                  <TextField
                    variant="standard"
                    type="number"
                    className="dark:text-white"
                    value={item.quantity}
                    onChange={(e) =>
                      onItemChange(index, { ...item, quantity: e.target.value })
                    }
                    inputProps={{
                      min: "0",
                      style: { textAlign: "right" },
                    }}
                  />
                </TableCell>
                <TableCell className="dark:text-white" align="right">
                  <TextField
                    variant="standard"
                    type="number"
                    className="dark:text-white"
                    value={item.price}
                    onChange={(e) =>
                      onItemChange(index, { ...item, price: e.target.value })
                    }
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {currency}
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{
                      min: "0",
                      step: "0.01",
                      style: { textAlign: "right" },
                    }}
                  />
                </TableCell>
                <TableCell className="dark:text-white" align="right">
                  {currency} {item.total.toFixed(2)}
                </TableCell>
                <TableCell className="dark:text-white" align="center">
                  <IconButton
                    size="small"
                    onClick={() => onItemRemove(index)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="outlined" onClick={onAddItem} sx={{ mt: 2 }}>
        Add Item
      </Button>
    </div>
  );
};

export default ItemsTable;
