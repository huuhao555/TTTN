import { useContext, useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./style.scss";
import { apiLink } from "../../../../config/api";
import { UserContext } from "../../../../middleware/UserContext";

const TurnOver = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const TARGET_REVENUE = 100000000; // Mục tiêu doanh thu giả định
  const { dataUser } = useContext(UserContext);
  const shopId = dataUser?.dataUser?.shopId;

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await fetch(
          `${apiLink}/api/order/revenue/shop/${shopId}`
        );
        if (!response.ok) throw new Error("Failed to fetch revenue");

        const data = await response.json();
        console.log(data);
        setTotalRevenue(data.totalRevenue || 0);
      } catch (err) {
        console.error("Error fetching revenue:", err);
      }
    };

    if (shopId) fetchRevenue();
  }, [shopId]);

  const data = [
    { name: "Đã đạt", value: totalRevenue },
    { name: "Còn thiếu", value: Math.max(TARGET_REVENUE - totalRevenue, 0) }
  ];

  const COLORS = ["#FF6384", "#E0E0E0"];

  return (
    <div className="turnover">
      <h2>Doanh thu cửa hàng</h2>
      <PieChart width={300} height={300}>
        <Pie
          dataKey="value"
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={70}
          outerRadius={100}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
      <div className="turnover-total">
        Tổng doanh thu: {totalRevenue.toLocaleString()}đ
      </div>
    </div>
  );
};

export default TurnOver;
