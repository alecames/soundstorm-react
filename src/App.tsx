import Card from "./lib/Card";
import "./styles.sass";

const Sidebar = () => {
	const items = [
		{ label: "HOME" },
		{
			label: "PLAYLISTS",
			subItems: ["JAMS", "WORKOUT", "BACKGROUND", "CHILL", "JAZZ"],
		},
		{ label: "SETTINGS" },
		{ label: "MY ACCOUNT" },
	];

	return (
		<div className="sidebar">
			<a href="/" className="logo-container" data-home="true">
				<img src="dark-logo.svg" alt="logo" className="logo" />
			</a>
			<hr className="logo-line" />
			{items.map((item, index) => (
				<div key={index}>
					<div className="sidebar-item">{item.label}</div>
					{item.subItems && (
						<div className="sub-items">
							{item.subItems.map((subItem, subIndex) => (
								<div key={subIndex} className="sidebar-subitem">
									{subItem}
								</div>
							))}
						</div>
					)}
				</div>
			))}
		</div>
	);
};

const Main = () => {
	const cards = [
		{
			title: "The Caracal Project - The lights on your face.",
			content: "Description",
		},
		{
			title: "Sam Gellaitry & PinkPantheress - Picture in my mind",
			content: "Description",
		},
		{
			title: "DROELOE - Sunburn",
			content: "Description",
		},
		{
			title: "Sam Gelaitry - Assumptions",
			content: "Description",
		},
		{
			title: "DROELOE & IMANU - Catalyst",
			content: "Description",
		},
		{
			title: "Skrillex & Joker & Sleepnet - Tears",
			content: "Description",
		},
		{
			title: "CASIOPEA - Time Limit",
			content: "Description",
		},
		{
			title: "CASIOPEA - Midnight Rendezvous",
			content: "Description",
		},
		{
			title: "CASIOPEA - Asayake",
			content: "Description",
		},
	];

	return (
		<div className="main">
			<div className="header">
				<h1>For You</h1>
			</div>
			<div className="card-container">
				{cards.map((card, index) => (
					<Card key={index} title={card.title} content={card.content} />
				))}
			</div>
		</div>
	);
};

const App = () => (
	<div>
		<Sidebar />
		<Main />
	</div>
);

export default App;
