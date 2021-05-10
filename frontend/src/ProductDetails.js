import { useParams } from "react-router";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { API, graphqlOperation } from "aws-amplify";
import { getProduct } from "./graphql/queries";
import Notification, { NotificationTypes } from "./Notification";

const ProductDetails = () => {
  const location = useLocation();

  const { id } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(location.state?.success || false);

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProduct() {
    try {
      setLoading(true);
      const productsData = await API.graphql(
        graphqlOperation(getProduct, { id: id })
      );
      const produ = productsData.data.getProduct;
      setProducts(produ);
      setLoading(false);
    } catch (err) {
      alert(err.status);
    }
  }

  if (loading) {
    return (
      <h1 className="text-2xl grid justify-items-center mt-48">Loading ...</h1>
    );
  }

  return (
    <div>
      {isOpen && (
        <Notification
          type={NotificationTypes.SUCCESS}
          title="Changes were accepted!"
          message="You have successfully modified the product"
          onClose={() => setIsOpen(false)}
        />
      )}
      {products && !loading && (
        <div className="grid justify-items-center mb-16 grid-cols-1 ">
          <div className="w-60 h-80  margin-auto bg-gradient-to-br from-amber-400 to-red-400 rounded-xl mt-10 mb-5 ">
            <img
              src={products.images ? products.images[0] : null}
              alt="error"
              className=""
            />
          </div>

          <div className="w-96 text-center font-karla font-semibold text-white text-base h-max bg-gradient-to-l rounded-xl from-amber-400 to-red-400 py-5 mb-5 ">
            <h1 className="text-3xl">{products.name}</h1>
            <br />
            <ul>
              <li>
                Brief description:
                <br />
                {products.briefDescription}
              </li>
              <br />
              <li>Category: {products.category}</li>
              <br />
              <li>
                Nutri-score: <span>{products.nutriScore}</span>
              </li>
            </ul>
          </div>

          <div className="hidden xs:block mb-5">
            <table className="table ">
              <tbody className="">
                <tr className=" border-b-2 solid border-amber-500 border-collapse">
                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/energy.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        {" "}
                        Energy
                      </h4>
                      <h5>{products.nutritionalValues.energy} (kJ/kcal)</h5>
                    </div>
                  </td>

                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/fats.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Fats
                      </h4>
                      <h5>{products.nutritionalValues.fats} (g)</h5>
                    </div>
                  </td>
                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5 ">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/saturatedFats.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Saturated fats
                      </h4>
                      <h5>{products.nutritionalValues.saturatedFats} (g)</h5>
                    </div>
                  </td>
                  <td className="w-44 h-36">
                    <div className="grid justify-items-center px-5 ">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/proteins.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Proteins
                      </h4>
                      <h5>{products.nutritionalValues.proteins} (g)</h5>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5 mt-3">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/carbs.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        {" "}
                        <span> Carbohydrates </span>
                      </h4>
                      <h5>{products.nutritionalValues.carbs} (g)</h5>
                    </div>
                  </td>

                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5 mt-3">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/sugar.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Sugar
                      </h4>
                      <h5>{products.nutritionalValues.sugar} (g)</h5>
                    </div>
                  </td>
                  <td className="border-r-2 solid border-amber-500 w-44 h-36">
                    <div className="grid justify-items-center px-5 mt-3 ">
                      <img
                        className="w-10 h-10 text-white mb-2"
                        src="/images/fibers.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Fibers
                      </h4>
                      <h5>{products.nutritionalValues.fibers} (g)</h5>
                    </div>
                  </td>
                  <td className="w-44 h-36">
                    <div className="grid justify-items-center px-5 mt-3">
                      <img
                        className="w-10 h-10 text-white mb-2  "
                        src="/images/salt.png"
                        alt=""
                      />
                      <h4 className="font-karla font-semibold text-base">
                        Salt
                      </h4>
                      <h5>{products.nutritionalValues.salt}(g)</h5>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full text-center font-karla font-semibold text-white text-xl h-max bg-gradient-to-l rounded-xl from-amber-400 to-red-400 py-5 mb-5 ">
            <ul>
              <h1 className="text-2xl">On 100 g:</h1>
              <br />
              <li>Energy: {products.nutritionalValues.energy} (KJ/kcal)</li>
              <br />
              <li>Fats: {products.nutritionalValues.fats} (g)</li>
              <br />
              <li>
                Saturated fats: {products.nutritionalValues.saturatedFats} (g)
              </li>
              <br />
              <li>Proteins: {products.nutritionalValues.proteins} (g)</li>
              <br />
              <li>Crabonhydrates: {products.nutritionalValues.carbs} (g)</li>
              <br />
              <li>Sugar: {products.nutritionalValues.sugar} (g)</li>
              <br />
              <li>Fibers: {products.nutritionalValues.fibers} (g)</li>
              <br />
              <li>Salt: {products.nutritionalValues.salt} (g)</li>
            </ul>
          </div>

          <div className="w-full text-center font-karla font-semibold text-white text-xl h-max bg-gradient-to-l rounded-xl from-amber-400 to-red-400 py-5 mb-5 ">
            <ul>
              <h1 className="text-2xl">Description:</h1>
              <br />
              <li>Alcohol: {products.description.alcohol} </li>
              <br />
              <li>Allergens: {products.description.allergens} </li>
              <br />
              <li>
                Country of origin: {products.description.countryOfOrigin}{" "}
              </li>
              <br />
              <li>Expiry date: {products.description.expiryDate}</li>
              <br />
              <li>Imports: {products.description.imports}</li>
              <br />
              <li>Ingredients: {products.description.ingredients}</li>
              <br />
              <li>Maintenance: {products.description.maintenance}</li>
              <br />
              <li>Producer: {products.description.producer}</li>
            </ul>
          </div>

          <div className="w-full h-max bg-gradient-to-l justify-items-start rounded-xl text-center font-karla font-semibold text-white text-xl from-amber-400 to-red-400 py-5 mb-5 ">
            <ul>Date: {products.currentPrice.date} </ul>
            <br />
            <ul>Discount amount: {products.currentPrice.discountAmount} </ul>
            <br />
            <ul>Discount end date: {products.currentPrice.discountEndDate} </ul>
            <br />
            <ul>Discount price: {products.currentPrice.discountPrice} </ul>
            <br />
            <ul>
              Dsicount start date: {products.currentPrice.discountStartDate}{" "}
            </ul>
            <br />
            <ul>Regular price: {products.currentPrice.regularPrice} </ul>
            <br />
            <ul>Barcode: {products.barcode} </ul>
            <br />
            <ul>Store: {products.store} </ul>
            <br />
          </div>

          <div>
            <Link
              to={`/edit/${id}`}
              className="mt-5 px-6 rounded-xl focus:outline-none bg-red-500 font-karla font-semibold text-lg text-white"
            >
              Edit
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
