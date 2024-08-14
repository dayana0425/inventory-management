"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Stack,
  Typography,
  Button,
  Modal,
  TextField,
  Card,
  CardContent,
  IconButton,
  Chip,
} from "@mui/material";
import { AddCircleOutline, RemoveCircleOutline } from "@mui/icons-material";
import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  borderRadius: "16px",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    updateInventory();
  }, []);

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
      gap={4}
      bgcolor={"#f7f7f7"}
      padding={4}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={"row"} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
              sx={{
                bgcolor: "#00796b",
                "&:hover": { bgcolor: "#004d40" },
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Button
        variant="contained"
        onClick={handleOpen}
        sx={{
          bgcolor: "#ffa726",
          "&:hover": { bgcolor: "#fb8c00" },
          padding: "10px 20px",
          fontSize: "16px",
        }}
      >
        Add New Item
      </Button>
      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
          width: "800px",
          marginBottom: 2,
          backgroundColor: "#fff8e1",
          borderRadius: "8px",
        }}
      />
      <Box width="800px">
        <Typography
          variant={"h4"}
          color={"#00796b"}
          textAlign={"center"}
          gutterBottom
        >
          Pantry Inventory
        </Typography>
        <Stack spacing={2} overflow={"auto"}>
          {filteredInventory.length > 0 ? (
            filteredInventory.map(({ name, quantity }) => (
              <Card
                key={name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px",
                  borderRadius: "16px",
                  bgcolor: "#ffecb3",
                }}
              >
                <CardContent>
                  <Typography
                    variant={"h5"}
                    color={"#ff7043"}
                    fontWeight={"bold"}
                  >
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Chip
                    label={`Quantity: ${quantity}`}
                    color="primary"
                    sx={{ marginTop: "8px" }}
                  />
                </CardContent>
                <Box>
                  <IconButton
                    color="error"
                    onClick={() => removeItem(name)}
                    sx={{ marginRight: "8px" }}
                  >
                    <RemoveCircleOutline />
                  </IconButton>
                  <IconButton
                    color="success"
                    onClick={() => addItem(name)}
                  >
                    <AddCircleOutline />
                  </IconButton>
                </Box>
              </Card>
            ))
          ) : (
            <Typography
              variant={"h6"}
              textAlign={"center"}
              color={"#d32f2f"}
            >
              {inventory.length > 0 ? "No items found" : "No items in inventory"}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}