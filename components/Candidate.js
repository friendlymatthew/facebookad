import USAMap from "react-usa-map";
import React, { useEffect, useState } from "react";

export default function Candidate(props) {
	const [scores, setScores] = useState({});

	const dHue = {
		0: "#EFF6FF",
		1: "#DBEAFE",
		2: "#BFDBFE",
		3: "#93C5FD",
		4: "#7DD3FC",
		5: "#60A5FA",
		6: "#3B82F6",
		7: "#2563EB",
		8: "#1D4ED8",
		9: "#1E40AF",
		10: "#1E3A8A",
	};

	const rHue = {
		0: "#FEF2F2",
		1: "#FEE2E2",
		2: "#FECACA",
		3: "#FCA5A5",
		4: "#F87171",
		5: "#EF4444",
		6: "#DC2626",
		7: "#C2410C",
		8: "#B91C1C",
		9: "#991B1B",
		10: "#7F1D1D",
	};

	const [hue, setHue] = useState();

	useEffect(() => {
		let costs = Object.values(props.data);

		costs = costs.sort((a, b) => a - b);

		let score = {};

		{
			props.party === "d" ? setHue(dHue) : setHue(rHue);
		}

		for (let idx = 0; idx < costs.length; idx++) {
			let key = getKeyByValue(props.data, costs[idx]);

			score[key] = {
				fill: hue[Math.floor(idx / 5)],
				clickHandler: (event) =>
					showData(
						event.target.dataset.name,
						props.data[event.target.dataset.name]
					),
			};
		}

		setScores(score);
	}, [props.data]);

	const showData = (state, count) => {
		console.log(state, count);
	};

	function getKeyByValue(object, value) {
		return Object.keys(object).find((key) => object[key] === value);
	}

	const mapHandler = (event) => {
		let stateKey = event.target.dataset.name;
		console.log("state", stateKey);
		console.log(props.data[stateKey]);
	};

	return (
		<div className="">
			{props.id === "dt" ? (
				<div className="flex justify-end">
					<div>
						<div className="font-libre text-3xl  font-bold">
							Donald J. Trump
						</div>
						<div className="flex justify-start lg:justify-end text-md font-sans font-light italic opacity-80">
							Republican
						</div>
					</div>
				</div>
			) : (
				<div className="">
					<div className="font-libre text-3xl  font-bold">Joseph R. Biden</div>
					<div className="text-md font-sans font-light italic opacity-80">
						Democrat
					</div>
				</div>
			)}

			<USAMap
				customize={scores}
				width={600}
				height={400}
				onClick={mapHandler}
			/>
		</div>
	);
}
