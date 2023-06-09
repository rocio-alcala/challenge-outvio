import { Fragment, useState } from "react";
import { XAxis, YAxis, BarChart, Bar, Tooltip, Cell, Legend } from "recharts";
import { useQuery } from "react-query";
import { ThreeCircles } from "react-loader-spinner";

function RenderBarChart({ selectedCountry, darkMode, options }) {
  const [dataRender, setDataRender] = useState("total_cases");
  const [topNumber, setTopNumber] = useState(10);

  const { data } = useQuery("latestData", () => {
    return fetch(
      "https://covid.ourworldindata.org/data/latest/owid-covid-latest.json"
    ).then((response) => {
      return response.json();
    });
  });

  if (!data)
    return (
      <main>
        <div className="loading">
          <ThreeCircles
            height="100"
            width="100"
            color="#644964"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
            ariaLabel="three-circles-rotating"
            outerCircleColor=""
            innerCircleColor=""
            middleCircleColor=""
          />
          <p>Please wait while loading the covid data</p>
        </div>
      </main>
    );

  const dataArray = Object.values(data).filter(
    (obj) => obj.continent !== undefined && obj.continent !== null
  );

  const topRender = dataArray
    .sort((a, b) => b[dataRender] - a[dataRender])
    .slice(0, topNumber);

  return (
    <Fragment>
      <section className="chart">
        <BarChart width={800} height={500} data={topRender}>
          <Bar dataKey={dataRender} name={dataRender} fill="#b184b1">
            {topRender.map((country) => (
              <Cell
                cursor="pointer"
                fill={
                  country.location === selectedCountry.location
                    ? "#82ca9d"
                    : "#b184b1"
                }
                key={country.location}
              />
            ))}
          </Bar>
          <XAxis
            stroke={darkMode ? "white" : "black"}
            name="Country"
            dataKey="location"
          />
          <YAxis stroke={darkMode ? "white" : "black"} />
          <Legend />
          <Tooltip />
        </BarChart>
      </section>
      <aside className="controls">
        <div>
          <label for="cases">
            <input
              onClick={() => {
                setDataRender("total_cases");
              }}
              checked={dataRender === "total_cases"}
              type="radio"
              name="controls"
              id="cases"
            ></input>
            Total cases
          </label>
          <label for="deaths">
            <input
              onClick={() => {
                setDataRender("total_deaths");
              }}
              checked={dataRender === "total_deaths"}
              type="radio"
              name="controls"
              id="deaths"
            ></input>
            Total deaths
          </label>
        </div>
        <div>
          <label for="top">
            Select top number of countries
            <select
              value={topNumber}
              id="top"
              onChange={(e) => setTopNumber(e.target.value)}
            >
              {options.map((number, index) =>
                index === 0 ? null : (
                  <option value={options.indexOf(number)}>
                    {options.indexOf(number)}
                  </option>
                )
              )}
            </select>
          </label>
        </div>
      </aside>
    </Fragment>
  );
}

export default RenderBarChart;
