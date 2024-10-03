import FlowerShopItem from "./FlowerShopItem";
import './FlowerShop.css';
const FlowerShop = ({ flowerList, selectedFlowerType, typeList, setTypeList, calculatePrice, updateTotalQuantity }) => {
  return (
    <div className="flower-shop-grid">
      {flowerList.filter((flower) => flower.type === selectedFlowerType).map((flower, index) => (
        <FlowerShopItem key={index} flower={flower}
          flowerTypeList={typeList}
          setFlowerTypeList={setTypeList}
          calculatePrice={calculatePrice}
          updateTotalQuantity={updateTotalQuantity}
        />
      ))}
    </div>
  );
};

export default FlowerShop;