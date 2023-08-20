const express = require("express");
const cors = require("cors");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/User.route");
const { productRouter } = require("./routes/Product.route");
const { cartRouter } = require("./routes/Cart.route");
const { Validator } = require("./middlewares/Validator.middleware");

const app = express();
app.use(express.json());
app.use(cors({
    origin: "*"
}));

app.use("/products", productRouter);
app.use("/cart", cartRouter);

// Validation for all fields
app.use(Validator);
app.use("/users", userRouter);

app.listen(8000, async () => {
    try {
        await connection;
        console.log("Connected to the Database of Wondermart");
    }
    catch (err) {
        console.log(err);
        console.log("Connection Failed!");
    }
    console.log(`Server is running...`);
});