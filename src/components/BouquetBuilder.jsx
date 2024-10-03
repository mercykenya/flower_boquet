import { useState, useEffect } from "react";

import { AppBar, Toolbar, Typography, IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import logo from "/icons/logo.png";
import "./BouquetBuilder.css";
import BouquetSizeSelector from "./BouquetSize";
import FlowerTypeButton from "./FlowerTypeButton";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import dummyData from "./dummyData";
import FlowerShop from "./FlowerShop";
import Cart from "./Cart";
import FinalCart from "./FinalCart";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import VisualBouquet from "./VisualBouquet";
import GenerateNotePage from "./GenerateNotePage";

const BouquetBuilder = ({
  userPreferences,
  templatePreferences,
  preferredBouquetsize,
}) => {
  const [selectedFlowerType, setSelectedFlowerType] = useState("Container");
  const [focalFlowers, setFocalFlowers] = useState([]);
  const [fillerFlowers, setFillerFlowers] = useState([]);
  const [foliageFlowers, setFoliageFlowers] = useState([]);
  const [containerOptions, setContainerOptions] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [cartView, setCartView] = useState(false);
  const [bouquetSize, setBouquetSize] = useState(preferredBouquetsize);
  const [flowerNumber, setFlowerNumber] = useState(0);
  const [flowerLimit, setFlowerLimit] = useState(0);

  const [userPreferencesFlowers, setUserPreferencesFlowers] = useState([]);

  const [selectedNote, setSelectedNote] = useState("");
  const [customNote, setCustomNote] = useState("");

  const [generateNoteView, setGenerateNoteView] = useState(false);
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  const templates = {
    partner: {
      valentines: {
        Focal: "Red Rose",
        Filler: "Queen Anne's Lace",
        Foliage: "Ruscus",
      },
      easter: { Focal: "Tulip", Filler: "Lavender", Foliage: "Huckleberry" },
      romance: {
        Focal: "Red Rose",
        Filler: "Queen Anne's Lace",
        Foliage: "Ruscus",
      },
      appreciation: { Focal: "Hydrangea", Filler: "Lavender", Foliage: "Nagi" },
      apology: {
        Focal: "Hydrangea",
        Filler: "Baby's Breath",
        Foliage: "Fern",
      },
      fun: { Focal: "Garden Rose", Filler: "Baby's Breath", Foliage: "Nagi" },
    },
    familyMember: {
      valentines: {
        Focal: "Red Rose",
        Filler: "Queen Anne's Lace",
        Foliage: "Ruscus",
      },
      easter: { Focal: "Tulip", Filler: "Lavender", Foliage: "Huckleberry" },
      appreciation: { Focal: "Hydrangea", Filler: "Lavender", Foliage: "Nagi" },
      apology: {
        Focal: "Chrysanthemum",
        Filler: "Baby's Breath",
        Foliage: "Fern",
      },
      fun: { Focal: "Buttercup", Filler: "Baby's Breath", Foliage: "Nagi" },
    },
    friend: {
      valentines: {
        Focal: "Red Rose",
        Filler: "Queen Anne's Lace",
        Foliage: "Ruscus",
      },
      easter: { Focal: "Tulip", Filler: "Lavender", Foliage: "Huckleberry" },
      appreciation: { Focal: "Hydrangea", Filler: "Lavender", Foliage: "Nagi" },
      apology: {
        Focal: "Chrysanthemum",
        Filler: "Baby's Breath",
        Foliage: "Fern",
      },
      fun: { Focal: "Buttercup", Filler: "Baby's Breath", Foliage: "Nagi" },
    },
  };

  const prePopulateCart = (
    focalName,
    fillerName,
    foliageName,
    sizeMultiplier
  ) => {
    const focalFlower = dummyData.flowers.find(
      (flower) => flower.name === focalName && flower.type === "Focal"
    );
    const fillerFlower = dummyData.flowers.find(
      (flower) => flower.name === fillerName && flower.type === "Filler"
    );
    const foliageFlower = dummyData.flowers.find(
      (flower) => flower.name === foliageName && flower.type === "Foliage"
    );

    // Prepare new flower arrays with the correct quantity based on the size
    const newFocalFlowers = focalFlower
      ? [{ ...focalFlower, quantity: 2 * sizeMultiplier }]
      : [];
    const newFillerFlowers = fillerFlower
      ? [{ ...fillerFlower, quantity: 3 * sizeMultiplier }]
      : [];
    const newFoliageFlowers = foliageFlower
      ? [{ ...foliageFlower, quantity: 1 * sizeMultiplier }]
      : [];

    // Update the state with these new arrays
    setFocalFlowers(newFocalFlowers);
    setFillerFlowers(newFillerFlowers);
    setFoliageFlowers(newFoliageFlowers);
    setContainerOptions([
      {
        name: "Brown Wrap",
        type: "Container",
        unit: "piece",
        price: 2.0,
        priceRange: "$",
        quantity: 1,
        photoName: "wrap-brown.png",
        occasion: ["all"],
        shoppingFor: ["all"],
      },
    ]);

    // Call calculatePrice to update the total price
    calculatePrice();
  };

  const createTemplate = (recipient, occasion, size) => {
    const sizeMultiplier = size === "Small" ? 1 : size === "Medium" ? 2 : 3;
    const template = templates[recipient]?.[occasion];

    if (template) {
      prePopulateCart(
        template.Focal,
        template.Filler,
        template.Foliage,
        sizeMultiplier
      );
    }
  };

  useEffect(() => {
    if (preferredBouquetsize) {
      setBouquetSize(preferredBouquetsize);
    }
  }, [preferredBouquetsize]);

  useEffect(() => {
    if (templatePreferences) {
      const { shoppingFor, occasion, size } = templatePreferences;
      createTemplate(shoppingFor, occasion, size);
    }

    if (userPreferences) {
      const filteredFlowers = dummyData["flowers"].filter(
        (flower) =>
          (userPreferences.occasion === "all" ||
            flower.occasion.includes(userPreferences.occasion)) &&
          (userPreferences.shoppingFor === "all" ||
            flower.shoppingFor.includes(userPreferences.shoppingFor))
      );
      setUserPreferencesFlowers(filteredFlowers);
    }
  }, [userPreferences, templatePreferences]);

  const calculatePrice = () => {
    let sum = 0;
    focalFlowers.forEach((flower) => {
      sum += flower.price * flower.quantity;
    });
    fillerFlowers.forEach((flower) => {
      sum += flower.price * flower.quantity;
    });
    foliageFlowers.forEach((flower) => {
      sum += flower.price * flower.quantity;
    });
    containerOptions.forEach((flower) => {
      sum += flower.price;
    });
    setTotalPrice(sum);
  };

  const updateQuantity = (index, newQuantity) => {
    if (selectedFlowerType === "Focal") {
      const updatedFlowers = [...focalFlowers];
      updatedFlowers[index].quantity = newQuantity;
      if (newQuantity === 0) {
        const filteredFlowers = updatedFlowers.filter(
          (flower, i) => i !== index
        );
        setFocalFlowers(filteredFlowers);
      } else {
        setFocalFlowers(updatedFlowers);
      }
    } else if (selectedFlowerType === "Filler") {
      const updatedFlowers = [...fillerFlowers];
      updatedFlowers[index].quantity = newQuantity;
      if (newQuantity === 0) {
        const filteredFlowers = updatedFlowers.filter(
          (flower, i) => i !== index
        );
        setFillerFlowers(filteredFlowers);
      } else {
        setFillerFlowers(updatedFlowers);
      }
    } else if (selectedFlowerType === "Foliage") {
      const updatedFlowers = [...foliageFlowers];
      updatedFlowers[index].quantity = newQuantity;
      if (newQuantity === 0) {
        const filteredFlowers = updatedFlowers.filter(
          (flower, i) => i !== index
        );
        setFoliageFlowers(filteredFlowers);
      } else {
        setFoliageFlowers(updatedFlowers);
      }
    } else {
      const updatedFlowers = [...containerOptions];
      updatedFlowers[index].quantity = newQuantity;
      if (newQuantity === 0) {
        const filteredFlowers = updatedFlowers.filter(
          (flower, i) => i !== index
        );
        setContainerOptions(filteredFlowers);
      } else {
        setContainerOptions(updatedFlowers);
      }
    }
  };

  const updateTotalQuantity = () => {
    let sum = 0;
    focalFlowers.forEach((flower) => {
      sum += flower.quantity;
    });
    fillerFlowers.forEach((flower) => {
      sum += flower.quantity;
    });
    foliageFlowers.forEach((flower) => {
      sum += flower.quantity;
    });
    setFlowerNumber(sum);
  };

  const updateFlowerLimit = () => {
    if (bouquetSize === "Small") {
      setFlowerLimit(6);
    } else if (bouquetSize === "Medium") {
      setFlowerLimit(12);
    } else {
      setFlowerLimit(18);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [focalFlowers, fillerFlowers, foliageFlowers, containerOptions]);

  useEffect(() => {
    updateTotalQuantity();
    updateFlowerLimit();
  }, [
    focalFlowers,
    fillerFlowers,
    foliageFlowers,
    containerOptions,
    bouquetSize,
  ]);

  return (
    <div className="App">
      <AppBar
        position="static"
        style={{ backgroundColor: "mustard !important" }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => {
              cartView ? setCartView(false) : navigate("/");
            }}
          >
            <ArrowBackIcon
              style={{
                scale: "1.5",
              }}
            />
          </IconButton>
          <div style={{ margin: "0 auto" }}>
            <img src={logo} alt="Logo" className="App-logo" />
          </div>
          <IconButton
            data-testid="cart-icon"
            color="inherit"
            aria-label="cart"
            onClick={() => setCartView(!cartView)}
          >
            <ShoppingCartIcon style={{ scale: "1.5" }} />
          </IconButton>
        </Toolbar>
      </AppBar>

      {cartView ? (
        generateNoteView ? (
          <GenerateNotePage
            setNote={setNotes}
            setGenerateNoteView={setGenerateNoteView}
          />
        ) : (
          <>
            <FinalCart
              focalFlowers={focalFlowers}
              fillerFlowers={fillerFlowers}
              foliageFlowers={foliageFlowers}
              containerOptions={containerOptions}
              totalPrice={totalPrice}
              notes={notes}
              setGenerateNoteView={setGenerateNoteView}
            />
          </>
        )
      ) : (
        <>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="subtitle1"
              style={{
                marginRight: "8px",
                fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 1000,
              }}
            >
              Need some help?
            </Typography>

            <div style={{ width: "10rem" }}>
              <Button
                className="start-quiz-button"
                variant="contained"
                color="primary"
                onClick={() => navigate("/quiz")}
              >
                Start Quiz
              </Button>
            </div>
          </div>

          <BouquetSizeSelector
            bouquetSizeSelection={bouquetSize}
            setBouquetSize={setBouquetSize}
          />
          <div
            className="flower-type-button-container"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <FlowerTypeButton
                flowerType={selectedFlowerType}
                setFlowerType={setSelectedFlowerType}
                value="Filler"
              />
            </div>

            <FlowerTypeButton
              flowerType={selectedFlowerType}
              setFlowerType={setSelectedFlowerType}
              value="Focal"
            />
            <FlowerTypeButton
              flowerType={selectedFlowerType}
              setFlowerType={setSelectedFlowerType}
              value="Foliage"
            />
            <FlowerTypeButton
              flowerType={selectedFlowerType}
              setFlowerType={setSelectedFlowerType}
              value="Container"
            />
          </div>
          <h3 style={{ marginBottom: "0" }}>{`${
            selectedFlowerType === "Container"
              ? "Containers"
              : selectedFlowerType + " Flowers"
          }`}</h3>
          <i>
            {selectedFlowerType === "Focal"
              ? "Focal flowers are the heart of your bouquet."
              : selectedFlowerType === "Filler"
              ? "Filler flowers add texture, volume, and balance to your bouquet."
              : selectedFlowerType === "Foliage" &&
                "Foliage provides a beautiful backdrop for your blooms."}
          </i>
          <Cart
            list={
              selectedFlowerType === "Focal"
                ? focalFlowers
                : selectedFlowerType === "Filler"
                ? fillerFlowers
                : selectedFlowerType === "Foliage"
                ? foliageFlowers
                : containerOptions
            }
            updateQuantity={updateQuantity}
          />
          {flowerNumber > flowerLimit && (
            <b style={{ color: "red", marginBottom: "0.3rem" }}>
              {`You have exceeded the limit of ${flowerLimit} flowers`}
            </b>
          )}
          <br />
          <VisualBouquet
            focalList={focalFlowers}
            fillerList={fillerFlowers}
            foliageList={foliageFlowers}
            containerList={containerOptions}
            bouquetSize={bouquetSize}
          />

          <div>
            <b>{`Total Price: $${totalPrice}.00`}</b>

            <IconButton
              color="inherit"
              aria-label="cart"
              onClick={() => setCartView(!cartView)}
              data-testid="add-to-cart-button"
            >
              <img src="/icons/flower.png" style={{ width: "2rem" }}></img> Add
              to cart
            </IconButton>
          </div>

          <FlowerShop
            flowerList={userPreferencesFlowers}
            selectedFlowerType={selectedFlowerType}
            typeList={
              selectedFlowerType === "Focal"
                ? focalFlowers
                : selectedFlowerType === "Filler"
                ? fillerFlowers
                : selectedFlowerType === "Foliage"
                ? foliageFlowers
                : containerOptions
            }
            setTypeList={
              selectedFlowerType === "Focal"
                ? setFocalFlowers
                : selectedFlowerType === "Filler"
                ? setFillerFlowers
                : selectedFlowerType === "Foliage"
                ? setFoliageFlowers
                : setContainerOptions
            }
            calculatePrice={calculatePrice}
            updateTotalQuantity={updateTotalQuantity}
          />
        </>
      )}
    </div>
  );
};

export default BouquetBuilder;
