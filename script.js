const express = require("express");
const { Router } = express;
const router = Router();

const PORT = 8080;

class ApiProducts {
  constructor() {
    this.products = [
      {
        title: "Escuadra",
        price: 123.45,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-256.png",
        id: 1,
      },
      {
        title: "Calculadora",
        price: 234.56,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/calculator-math-tool-school-256.png",
        id: 2,
      },
      {
        title: "Globo Terráqueo",
        price: 345.67,
        thumbnail:
          "https://cdn3.iconfinder.com/data/icons/education-209/64/globe-earth-geograhy-planet-school-256.png",
        id: 3,
      },
    ];

    router.use(express.json());
    router.use(express.urlencoded({ extended: true }));

    router
      .route("/")
      .get((req, res) => {
        res.json(this.products);
      })
      .post((req, res) => {
        const newProduct = req.body;
        newProduct.price = parseInt(newProduct.price);

        if (!this.products.length) {
          newProduct.id = 1;
        } else {
          newProduct.id = this.products.at(-1).id + 1;
        }

        this.products.push(newProduct);
        res.json(newProduct);
      });

    router
      .route("/:id")
      .get((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          res.json(product);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .put((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );

        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          this.products.push(req.body);
          console.log(this.products);
          res.json(
            `El producto con el id:${req.params.id} ha sido actualizado`
          );
        } else {
          res.json({ error: "producto no encontrado" });
        }
      })
      .delete((req, res) => {
        const product = this.products.find(
          (product) => product.id == req.params.id
        );
        if (product) {
          this.products = this.products.filter(
            (product) => product.id != req.params.id
          );

          console.log(this.products);

          res.json(`El producto con el id:${req.params.id} ha sido eliminado`);
        } else {
          res.json({ error: "producto no encontrado" });
        }
      });
  }

  getRouter() {
    return router;
  }
}

class App {
  constructor() {
    const app = express();
    const api = new ApiProducts();
    app.use("/static", express.static(__dirname + "/public"));
    app.use("/api/productos", api.getRouter());
    this.app = app;
  }

  start() {
    const server = this.app.listen(PORT, () => {
      console.log(
        `Servidor http escuchando en el puerto ${server.address().port}`
      );
    });
  }
}

const app = new App();

app.start();
