const pool = require('../config/postgresql');

const getStatistics = async (monthNumber) => {
  try {
    const stats = await pool.query(
      `SELECT 
        SUM(price) AS totalSale, 
        Count(*) AS totalItems,
        COUNT(*) FILTER (WHERE sold = true) AS totalSoldItems,
        COUNT(*) FILTER (WHERE sold = false) AS totalUnSold_items
      FROM transactions
      WHERE EXTRACT(MONTH FROM dateOfSale) = $1`,
      [monthNumber]
    );
    return(stats.rows[0]);
  } catch (err) {
    return { message: err.message };
  }
}

const getBarChartData = async (monthNumber) => {
    try {
      const result = await pool.query(
        `WITH price_ranges AS (
            SELECT * FROM (VALUES
              (0, 100, '0-100'),
              (101, 200, '101-200'),
              (201, 300, '201-300'),
              (301, 400, '301-400'),
              (401, 500, '401-500'),
              (501, 600, '501-600'),
              (601, 700, '601-700'),
              (701, 800, '701-800'),
              (801, 900, '801-900'),
              (901, 1000000, '901-above') -- Adjust the upper limit as needed
            ) AS t(min_price, max_price, label)
          ),
          transaction_counts AS (
            SELECT 
              CASE 
                WHEN price BETWEEN 0 AND 100 THEN '0-100'
                WHEN price BETWEEN 101 AND 200 THEN '101-200'
                WHEN price BETWEEN 201 AND 300 THEN '201-300'
                WHEN price BETWEEN 301 AND 400 THEN '301-400'
                WHEN price BETWEEN 401 AND 500 THEN '401-500'
                WHEN price BETWEEN 501 AND 600 THEN '501-600'
                WHEN price BETWEEN 601 AND 700 THEN '601-700'
                WHEN price BETWEEN 701 AND 800 THEN '701-800'
                WHEN price BETWEEN 801 AND 900 THEN '801-900'
                ELSE '901-above'
              END AS price_range,
              COUNT(*) AS count
            FROM transactions
            WHERE EXTRACT(MONTH FROM dateOfSale) = $1 
            GROUP BY price_range
          )
          SELECT pr.label AS price_range, COALESCE(tc.count, 0) AS count
          FROM price_ranges pr
          LEFT JOIN transaction_counts tc ON pr.label = tc.price_range
          ORDER BY min_price;`,
        [monthNumber]
      );
      return result.rows;
    } catch (err) {
      return { message: err.message };
    }
  };

  const getPieChartData = async (monthNumber) => {
    try {
      const result = await pool.query(
        `SELECT category, COUNT(*) 
        FROM transactions 
        WHERE EXTRACT(MONTH FROM dateOfSale) = $1 
        GROUP BY category`,
        [monthNumber]
      );
      return result.rows;
    } catch (err) {
      return { message: err.message };
    }
  };

module.exports.statistics = async(req,res)=>{
    const monthNumber = new Date(Date.parse(req.query.month + " 1, 2024")).getMonth() + 1;
    const statistics = await getStatistics(monthNumber);
    res.json(statistics);
};

module.exports.barChart = async(req,res)=>{
    const monthNumber = new Date(Date.parse(req.query.month + " 1, 2021")).getMonth() + 1;
    const barChartData = await getBarChartData(monthNumber);
    res.json(barChartData);
};

module.exports.pieChart = async (req,res)=>{
    const monthNumber = new Date(Date.parse(req.query.month + " 1, 2021")).getMonth() + 1;
    const pieChartData = await getPieChartData(monthNumber);
    res.json(pieChartData);
};

module.exports.combinedChart = async (req,res)=>{
    const monthNumber = new Date(Date.parse(req.query.month + " 1, 2021")).getMonth() + 1;
    try{
        const [statisticsData,barChartData,pieChartData] = await Promise.all([
            getStatistics(monthNumber),
            getBarChartData(monthNumber),
            getPieChartData(monthNumber)
        ])

        const combinedResponse = {
            statisticsData,
            barChartData,
            pieChartData
        };

        res.json(combinedResponse)
    }catch(error){
        res.status(500).json({ message: error.message });
    }
}