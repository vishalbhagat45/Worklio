import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function DashboardOrders() {
  const [orders, setOrders] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        let filteredOrders = res.data;

        if (user.role === "buyer") {
          filteredOrders = filteredOrders.filter(
            (order) => order.buyerId?._id === user._id
          );
        } else if (user.role === "freelancer") {
          filteredOrders = filteredOrders.filter(
            (order) => order.sellerId?._id === user._id
          );
        }

        setOrders(filteredOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId) => {
    try {
      await axios.patch(
        `/api/orders/${orderId}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Failed to cancel order:", err);
    }
  };

  const handleContact = (order) => {
    const recipientId =
      user.role === "buyer" ? order.sellerId?._id : order.buyerId?._id;
    if (recipientId) navigate(`/chat/${recipientId}`);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Dashboard - Orders</h1>

      {orders.length === 0 ? (
        <p>No orders to display.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <div key={order._id} className="border rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold">
                Gig:{" "}
                {order.gigId ? (
                  <span
                    onClick={() => navigate(`/gig/${order.gigId._id}`)}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {order.gigId.title}
                  </span>
                ) : (
                  "Deleted Gig"
                )}
              </h2>

              <p>
                Status:{" "}
                <span
                  className={`capitalize ${
                    order.status === "cancelled"
                      ? "text-red-500"
                      : order.status === "delivered"
                      ? "text-orange-500"
                      : order.status === "approved"
                      ? "text-green-600"
                      : ""
                  }`}
                >
                  {order.status}
                </span>
              </p>

              <p>Price: ₹{order.price}</p>

              {user.role !== "buyer" && (
                <p>Buyer: {order.buyerId?.username || "N/A"}</p>
              )}
              {user.role !== "freelancer" && (
                <p>Seller: {order.sellerId?.username || "N/A"}</p>
              )}

              <p className="text-gray-500 text-sm">
                Created At: {new Date(order.createdAt).toLocaleString()}
              </p>

              {/* Buttons */}
              <div className="flex gap-3 mt-3 flex-wrap">
                {user.role === "freelancer" && order.status === "active" && (
                  <DeliverWorkButton orderId={order._id} />
                )}

                {user.role === "buyer" && order.status === "delivered" && (
                  <ApproveOrderButton orderId={order._id} />
                )}

                {user.role === "buyer" && order.status === "active" && (
                  <button
                    onClick={() => handleCancel(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel Order
                  </button>
                )}

                <button
                  onClick={() => handleContact(order)}
                  className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
                >
                  Contact {user.role === "buyer" ? "Freelancer" : "Buyer"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
