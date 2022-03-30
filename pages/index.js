import react, { useState, useEffect, useRef } from "react";
import { data } from "../data";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Candidate from "../components/Candidate";
import { styled } from "@mui/material/styles";
import Map from "../components/Map";
import Head from "next/head";
import Footer from "../components/Footer";

export default function Viz() {
	const [compiled, setCompiled] = useState({});
	const [secondCompiled, setSecondCompiled] = useState({});
	const [weekRange, setWeekRange] = useState([10, 20]);
	const [weeks, setWeeks] = useState([]);
	const [tableBody, setTableBody] = useState([]);
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [mapData, setMapData] = useState([]);
	var formatter = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",

		// These options are needed to round to whole numbers if that's what you want.
		//minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
		//maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
	});

	let increment = 0;

	const PrettoSlider = styled(Slider)({
		height: 8,

		"& 	.MuiSlider-track": {
			backgroundColor: "#FDE047",
		},
	});

	useEffect(() => {
		console.log("LIFECYCLE START");
		let tempWeek = [];
		let justWeeks = [];
		data[0].date_data.map((weekData) => {
			justWeeks.push(weekData.date);
			tempWeek.push({ value: increment, label: weekData.date.slice(5) });
			increment = increment + 10;
		});
		setWeeks(tempWeek);
		justWeeks[1] = new Date(justWeeks[1]);
		justWeeks[2] = new Date(justWeeks[2]);
		setStartDate(justWeeks[1]);
		setEndDate(justWeeks[2]);

		search({ fromDate: "2020-04-18", endDate: "2020-04-25" });
		console.log("LIFECYCLE END");
	}, []);

	useEffect(() => {
		console.log("WEEK RANGE INIT");
		console.log("week range", weekRange);
		let fromIdx = weekRange[0] / 10;
		let endIdx = weekRange[1] / 10;
		if (weeks[fromIdx] && weeks[endIdx]) {
			search({
				fromDate: `2020-${weeks[fromIdx].label}`,
				endDate: `2020-${weeks[endIdx].label}`,
			});
		} else {
			search({ fromDate: "2020-04-18", endDate: "2020-04-25" });
		}

		{
			weeks[fromIdx]
				? setStartDate(`2020-${weeks[fromIdx].label}`)
				: setStartDate("April 18th");
		}
		{
			weeks[endIdx]
				? setEndDate(`2020-${weeks[endIdx].label}`)
				: setEndDate("April 25th, 2020");
		}

		console.log("WEEK RANGE END");
	}, [weekRange]);

	async function search({ fromDate, endDate }) {
		console.log("SEARCH INIT");
		// we need to update the result data for both biden and trump
		let bidenResult = data[0].date_data.filter(
			(week) => week.date >= fromDate && week.date <= endDate
		);

		let trumpResult = data[1].date_data.filter(
			(week) => week.date >= fromDate && week.date <= endDate
		);

		console.log("biden", bidenResult);
		console.log("trump", trumpResult);

		var bidenMapData = {};
		var trumpMapData = {};

		//toMapData
		for (let idx = 0; idx < bidenResult.length; idx++) {
			let spendstate = bidenResult[idx].spend_data;
			for (let kdx = 0; kdx < spendstate.length; kdx++) {
				let state = spendstate[kdx].region;
				let amount = spendstate[kdx].amt_spent;

				if (Object.keys(bidenMapData).includes(state)) {
					bidenMapData[state] += amount;
				} else {
					bidenMapData[state] = amount;
				}
			}
		}

		for (let jdx = 0; jdx < trumpResult.length; jdx++) {
			let spendstate = trumpResult[jdx].spend_data;

			for (let odx = 0; odx < spendstate.length; odx++) {
				let state = spendstate[odx].region;
				let amount = spendstate[odx].amt_spent;

				if (Object.keys(trumpMapData).includes(state)) {
					trumpMapData[state] += amount;
				} else {
					trumpMapData[state] = amount;
				}
			}
		}
		console.log("banannas", bidenMapData, trumpMapData);
		setMapData([bidenMapData, trumpMapData]);

		var body = [];

		for (const [state, cost] of Object.entries(bidenMapData)) {
			body.push({
				state: state,
				biden: cost,
			});
		}

		for (let idx = 0; idx < body.length; idx++) {
			let trumpCost = trumpMapData[body[idx].state];
			body[idx].trump = trumpCost;

			body[idx].net = trumpCost - body[idx].biden;
		}
		console.log("MY BODY", body);

		setTableBody(body);

		console.log("SEARCH END");
	}

	const handleSliderChange = (event, newValue) => {
		setWeekRange(newValue);
		formatData();
	};

	const formatData = () => {};

	const [bidenSort, setBidenSort] = useState(false);
	const [trumpSort, setTrumpSort] = useState(false);
	const [netSort, setNetSort] = useState(false);

	const handleBidenSort = () => {
		if (bidenSort) {
			//ascending
			tableBody.sort(function (a, b) {
				return parseFloat(a.biden) - parseFloat(b.biden);
			});

			setTableBody(tableBody);
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(b.biden) - parseFloat(a.biden);
			});
		}

		setBidenSort(!bidenSort);
	};

	const handleTrumpSort = () => {
		if (trumpSort) {
			//ascending
			tableBody.sort(function (a, b) {
				return parseFloat(a.trump) - parseFloat(b.trump);
			});

			setTableBody(tableBody);
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(b.trump) - parseFloat(a.trump);
			});
		}

		setTrumpSort(!trumpSort);
	};

	const handleNetSort = () => {
		if (netSort) {
			tableBody.sort(function (a, b) {
				return parseFloat(Math.abs(a.net)) - parseFloat(Math.abs(b.net));
			});
		} else {
			tableBody.sort(function (a, b) {
				return parseFloat(Math.abs(b.net)) - parseFloat(Math.abs(a.net));
			});
		}

		setNetSort(!netSort);
	};

	return (
		<div>
			<Head>
				<title>Spending</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link
					rel="preconnect"
					href="https://fonts.gstatic.com"
					crossOrigin="true"
				/>
				<link
					href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Source+Sans+Pro:wght@300;400&display=swap"
					rel="stylesheet"
				/>
			</Head>

			<section className="bg-slate-800 flex justify-center">
				<div className="w-10/12 mt-20">
					<div className="font-libre font-bold text-5xl mb-4 text-white">
						Visualizing Presidential Ad Spending
					</div>
					<div className="font-sans text-white text-md font-thin">
						In its tracking of campaign spending on Facebook, Wesleyan Media
						Project focuses on identifying the sources of money behind the ads.
						Facebook requires that advertisers post the “Paid for By”
						disclaimer, listing the organization that paid for the ad. Often,
						the same organization will engage dozens of Facebook pages to post
						the ads. Together with the Center for Responsible Politics, WMP
						matches the Facebook records against external data to identify the
						sponsors behind political ads. The numbers you are seeing in the map
						are an aggregation of the amounts posted by Facebook in the spending
						reports on the Facebook Ad Library webpage. We report the spending
						by week, with Sunday being the first day of a week.
					</div>
					<section className="flex justify-end mt-10 mb-20 text-white font-sans font-thin space-x-20">
						<a className="cursor-pointer underline hover:opacity-80">
							Wesleyan Media Project
						</a>

						<a
							className="cursor-pointer underline hover:opacity-80"
							href="https://github.com/mostvaluableshipfriendship"
						>
							Source Code
						</a>
					</section>
				</div>
			</section>

			<div className="bg-slate-600 text-white flex justify-center py-20">
				<section className="w-10/12">
					<div className="text-3xl font-bold font-libre">
						From {startDate} to {endDate}
					</div>
					<div className="flex justify-center">
						<Box sx={{ width: 1300 }}>
							<Slider
								value={weekRange}
								onChange={handleSliderChange}
								marks={weeks}
								className="my-10 text-white font-sans text-5xl"
								step={10}
								style={{
									"& .MuiSlider-thumb": {
										height: 18,
										width: 18,
										backgroundColor: "#FEF08A",
									},
									"& .MuiSlider-markLabel": {
										color: "#ffffff",
									},
								}}
								min={0}
								max={300}
							/>
						</Box>
					</div>
					<section className="my-20 flex flex-wrap justify-center">
						<Candidate id="jb" data={mapData[0]} party="d" />
						<Candidate id="dt" data={mapData[1]} party="r" />
					</section>

					<section>
						<div className="overflow-x-auto justify-center flex  py-3 rounded-xl">
							<table className="table table-compact w-full">
								<thead>
									<tr className="font-libre text-md bg-slate-800">
										<th className="py-2 ">State</th>
										<th
											className="cursor-pointer underline py-2  hover:opacity-80 transition ease-in duration-50 "
											onClick={handleBidenSort}
										>
											Biden Spending ($)
										</th>
										<th
											className="cursor-pointer underline py-2  hover:opacity-80 transition ease-in duration-50 "
											onClick={handleTrumpSort}
										>
											Trump Spending ($)
										</th>
										<th
											className="cursor-pointer py-2 underline hover:opacity-80 transition ease-in duration-50 "
											onClick={handleNetSort}
										>
											Net
										</th>
									</tr>
								</thead>
								<tbody>
									{tableBody.map((row) => {
										return (
											<tr
												key={row.net}
												className="border-y text-lg bg-gray-100 text-slate-900 border-slate-700 font-sans hover:bg-slate-700 hover:text-white transition ease-in duration-50"
											>
												<th className="font-thin p-1">{row.state}</th>
												<th className="font-thin p-1">
													{formatter.format(row.biden)}
												</th>
												<th className="font-thin p-1">
													{formatter.format(row.trump)}
												</th>
												{row.net < 0 ? (
													<th className="font-medium text-blue-500">
														+{formatter.format(row.net * -1)}
													</th>
												) : (
													<th className="font-medium text-red-600">
														+{formatter.format(row.net)}
													</th>
												)}
											</tr>
										);
									})}
								</tbody>
							</table>
						</div>
					</section>
				</section>
			</div>
			<Footer />
		</div>
	);
}
