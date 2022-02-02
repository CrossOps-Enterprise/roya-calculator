import { useEffect, useState } from "react";
import { InfoRounded } from "@mui/icons-material";
import { Icon, Tooltip, Slider } from "@mui/material";
import classes from "./styles.module.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as Tip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";

const GrowthCalculator = () => {
  interface LongTermRoiOpts {
    customerCount: number;
    churnRate: number;
    shortTermRoi: number;
  }

  interface LongTermRoiBottomLineOpts {
    reps: number;
    monthlySalary: number;
    hoursSaved: number;
  }

  const ADAPTIVE_PULSE_COST = 1500;
  const ADAPTIVE_PULSE_HOURS_SAVED = 40;

  const [shortTermRoi, setShortTermRoi] = useState(0);
  const [longTermRoi, setLongTermRoi] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [monthlyContractValue, setMonthlyContractValue] = useState(0);
  const [reps, setReps] = useState(0);
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [monthlyChurnRate, setMonthlyChurnRate] = useState(0);
  const [longTermRoiBottomLine, setLongTermRoiBottomLine] = useState(0);

  useEffect(() => {
    const shortRoi = calculateShortTermRoi(
      monthlyContractValue,
      ADAPTIVE_PULSE_COST
    );

    const longRoi = calculateLongTermRoi({
      customerCount: Number(customerCount),
      churnRate: Number(monthlyChurnRate),
      shortTermRoi: shortRoi,
    });

    const longRoiBottomLine = calculateLongTermRoiBottomline({
      monthlySalary: Number(monthlySalary),
      hoursSaved: ADAPTIVE_PULSE_HOURS_SAVED,
      reps: reps,
    });

    setShortTermRoi(shortRoi);
    setLongTermRoi(longRoi);
    setLongTermRoiBottomLine(longRoiBottomLine);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    shortTermRoi,
    longTermRoiBottomLine,
    monthlyContractValue,
    longTermRoi,
    customerCount,
    reps,
    monthlySalary,
    monthlyChurnRate,
    longTermRoiBottomLine,
  ]);

  const calculateShortTermRoi = (acv: number, ap: number): number => {
    return acv - ap;
  };

  const calculateLongTermRoi = (inputs: LongTermRoiOpts): number => {
    return inputs.customerCount * inputs.churnRate * inputs.shortTermRoi;
  };

  const calculateLongTermRoiBottomline = (
    inputs: LongTermRoiBottomLineOpts
  ): number => {
    const { hoursSaved, monthlySalary, reps } = inputs;
    return reps * monthlySalary * hoursSaved;
  };

  const iconStyles = {
    fontSize: 13,
    marginLeft: "2px",
    marginBottom: "-2px",
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tip,
    Legend
  );

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: "Month From Today",
        },
      },
      y: {
        title: {
          display: true,
          text: "ROI ($)",
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "ROI Growth Extrapolation",
      },
    },
  };

  const labels = Array.from({ length: 12 }, (_, i) => i + 1);

  const data = {
    labels,
    datasets: [
      {
        label: "Dataset",
        data: [...Array(12)].map((item, ind) => ind + 1),
        borderColor: "red",
        borderWidth: 0.4,
        pointDot: true,
        fill: true,
        pointColor: "#ff5200",
        pointBackgroundColor: "red",
        lineTension: 0.3,
      },
    ],
  };

  return (
    <>
      <div className={classes.formContainer}>
        <form>
          <h2 className='text-dark text-bold'>Growth Calculator</h2>
          <h4 className='text-dark text-bold mt-3' style={{ marginBottom: 0 }}>
            Customer Count:{" "}
            <Tooltip title='Number Of Current Customers'>
              <Icon component={InfoRounded} sx={iconStyles} />
            </Tooltip>
          </h4>
          <Slider
            min={0}
            max={2000}
            value={customerCount}
            onChange={(e: any) => setCustomerCount(e.target.value)}
          />
          <h4 style={{ margin: 0 }}>I've got {customerCount} customers</h4>
          <h4 className='text-dark text-bold mt-3' style={{ marginBottom: 0 }}>
            Monthly Churn Rate:
            <Tooltip title='(users at the beginning of the month - users at the end of the month) / users at the beginning of the month'>
              <Icon component={InfoRounded} sx={iconStyles} />
            </Tooltip>
          </h4>
          <Slider
            min={0}
            max={25}
            value={monthlyChurnRate}
            onChange={(e: any) => setMonthlyChurnRate(e.target.value)}
          />
          <h4 style={{ margin: 0 }}>
            my monthly churn rate is {monthlyChurnRate}%
          </h4>
          <h4 className='text-dark text-bold mt-3' style={{ marginBottom: 0 }}>
            Monthly account contract value:
            <Tooltip title='Average contract value for the customer per month'>
              <Icon component={InfoRounded} sx={iconStyles} />
            </Tooltip>
          </h4>
          <Slider
            min={0}
            max={5000}
            value={monthlyContractValue}
            onChange={(e: any) => setMonthlyContractValue(e.target.value)}
          />
          <h4 style={{ margin: 0 }}>
            My monthly account contract value is{" "}
            {currencyFormatter.format(monthlyContractValue)}
          </h4>
          <h4 className='text-dark text-bold mt-3' style={{ marginBottom: 0 }}>
            Reps:
            <Tooltip title='Number of users e.g. CSMs, AMs, AEs, Executives'>
              <Icon component={InfoRounded} sx={iconStyles} />
            </Tooltip>
          </h4>
          <Slider
            min={0}
            max={20}
            value={reps}
            onChange={(e: any) => setReps(e.target.value)}
          />
          <h4 style={{ margin: 0 }}>
            Number of users e.g. CSMs, AMs, AEs, Executives are {reps}
          </h4>
          <h4 className='text-dark text-bold mt-3' style={{ marginBottom: 0 }}>
            Average Monthly Salary:
            <Tooltip title='Average salary of reps/12 months'>
              <Icon component={InfoRounded} sx={iconStyles} />
            </Tooltip>
          </h4>
          <Slider
            min={0}
            max={10000}
            value={monthlySalary}
            onChange={(e: any) => setMonthlySalary(e.target.value)}
          />
          <h4 style={{ margin: 0 }}>
            My average monthly Salary is{" "}
            {currencyFormatter.format(monthlySalary)}
          </h4>

          <div
            className={classes.outputBoxes}
            style={{ color: "black", display: "block" }}
          >
            When AP saves {customerCount} customer, then your ROI is{" "}
            <b>{currencyFormatter.format(shortTermRoi)}</b>.
          </div>
          <div className={classes.outputBoxes} style={{ color: "black" }}>
            When AP can prevent and reduce up to ($) in lost revenue which is{" "}
            <b>{currencyFormatter.format(longTermRoi / ADAPTIVE_PULSE_COST)}</b>{" "}
            ROI
          </div>
          <div className={classes.outputBoxes} style={{ color: "black" }}>
            AP can help make your team more productive by giving them{" "}
            <b>({ADAPTIVE_PULSE_HOURS_SAVED} Hours)</b> back equaling{" "}
            <b> {currencyFormatter.format(monthlySalary)}</b> in salary
          </div>
          {/* <input type="submit" value="Submit" className={classes.submitButton} /> */}
        </form>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          width: "80%",
          margin: "0 auto",
        }}
      >
        <h1>Your growth ceiling</h1>
        <Chart type='line' options={options} data={data} />
      </div>
    </>
  );
};

export default GrowthCalculator;
