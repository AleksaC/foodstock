import { Link } from "react-router-dom";
const ProductsList = ({ data, loa }) => {
  if (loa) {
    return <h1 className="font-karla ml-60 mt-96 ">Loading...</h1>;
  }

  return (
    <div className="products-list">
      {data.map((product) => (
        <div key={product.id} className="product">
          <Link
            key={product.id}
            className="grid justify-items-center text-center text-white font-karla text-sm"
            to={`/product/${product.id}`}
          >
            <div className="w-40 h-40 rounded-xl">
              <img
                className="mt-4 rounded-xl mb-5"
                src={product.images ? product.images[0] : null}
                alt="error"
              />
            </div>
            <div className="mt-10">
              <h2 className="overflow-hidden mb-2">
                <span> Name: {product.name}</span>
              </h2>

              <ul>
                <li className="overflow-hidden mb-2">
                  {" "}
                  Brief description: {product.briefDescription}
                </li>

                <li className="overflow-hidden mb-2">
                  Category: {product.category}
                </li>

                <li className="overflow-hidden mb-2">
                  <span>Nutri-score: {product.nutriScore}</span>
                </li>
              </ul>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductsList;
