import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData.js";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersAction } from "../../actions/orderActions.js";
import { Link } from "react-router-dom";

export default function UserOrders() {
  // Ensure you're selecting only the required slice of state
  const { userOrders: orders = [], loading = false, error = null } = useSelector((state) => state.orderState || {});  
  //console.log("Redux State:", useSelector((state) => state.orderState));  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userOrdersAction());
  }, [dispatch]);

  const setOrders = () => {
    const data = {
      columns: [
        { label: "Order ID", field: "id", sort: "asc" },
        { label: "Number of items", field: "numOfItems", sort: "asc" },
        { label: "Amount", field: "amount", sort: "asc" },
        { label: "Status", field: "status", sort: "asc" },
        { label: "Actions", field: "actions", sort: "asc" }
      ],
      // Use a default empty array to avoid map on undefined
      rows: orders.map(userOrder => ({
        id: userOrder._id,
        numOfItems: userOrder.orderItems.length,
        amount: `$${userOrder.totalPrice}`,
        status: userOrder.orderStatus?.includes("Delivered") 
          ? <p style={{ color: "green" }}>{userOrder.orderStatus}</p> 
          : <p style={{ color: "red" }}>{userOrder.orderStatus}</p>,
        actions: (
          <Link to={`/order/${userOrder._id}`} className="btn btn-primary">
            <i className="fa fa-eye"></i>
          </Link>
        )
      }))
    };

    return data;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Fragment>
      <MetaData title="My Orders" />
      <h1 className="mt-5">My Orders</h1>
      <MDBDataTable 
        className="px-3"
        bordered
        striped
        hover
        data={setOrders()}
      />
    </Fragment>
  );
}
