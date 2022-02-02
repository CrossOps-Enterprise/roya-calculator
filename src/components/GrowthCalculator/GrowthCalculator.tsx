import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { InfoRounded } from "@mui/icons-material";
import { Icon, Tooltip, Paper, Slider } from "@mui/material";
import classes from "./styles.module.css";
import { theme } from "../../constants";

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

  const { handleSubmit } = useForm();

  const onSubmit = handleSubmit((data) => {
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
  });

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

  return (
    <div className={classes.formContainer}>
      <form onSubmit={onSubmit}>
        <h2 className="text-dark text-bold">Growth Calculator</h2>
        <h4 className="text-dark text-bold mt-3" style={{ marginBottom: 0 }}>
          Customer Count:{" "}
          <Tooltip title="Number Of Current Customers">
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
        <h4 className="text-dark text-bold mt-3" style={{ marginBottom: 0 }}>
          Monthly Churn Rate:
          <Tooltip title="(users at the beginning of the month - users at the end of the month) / users at the beginning of the month">
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
        <h4 className="text-dark text-bold mt-3" style={{ marginBottom: 0 }}>
          Monthly account contract value:
          <Tooltip title="Average contract value for the customer per month">
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
          My monthly account contract value is {monthlyContractValue}
        </h4>
        <h4 className="text-dark text-bold mt-3" style={{ marginBottom: 0 }}>
          Reps:
          <Tooltip title="Number of users e.g. CSMs, AMs, AEs, Executives">
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
        <h4 className="text-dark text-bold mt-3" style={{ marginBottom: 0 }}>
          Average Monthly Salary:
          <Tooltip title="Average salary of reps/12 months">
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
          My average monthly Salary is {monthlySalary}
        </h4>

        <div
          className="mt-3"
          style={{
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
          }}
        >
          <Paper elevation={3} sx={{ padding: 1, marginTop: 1, width: "100%" }}>
            <label className="text-dark text-bold" style={{ color: "black" }}>
              When AP saves {customerCount} customer, then your ROI is{" "}
              {currencyFormatter.format(shortTermRoi)}.
            </label>
          </Paper>
          <Paper elevation={3} sx={{ padding: 1, marginTop: 1, width: "100%" }}>
            <label className="text-dark text-bold" style={{ color: "black" }}>
              When AP can prevent and reduce up to ($) in lost revenue which
              is (# times [calculation=$ in lost revenue/AP cost] ROI
            </label>
          </Paper>
          <Paper elevation={3} sx={{ padding: 1, marginTop: 1, width: "100%" }}>
            <label className="text-dark text-bold" style={{ color: "black" }}>
              AP can help make your team more productive by giving them (
              {ADAPTIVE_PULSE_HOURS_SAVED} Hours) back equaling {monthlySalary}{" "}
              in salary
            </label>
          </Paper>
        </div>
        <input type="submit" value="Submit" className={classes.submitButton} />
      </form>
    </div>
  );
};

export default GrowthCalculator;
