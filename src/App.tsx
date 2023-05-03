import React, { useState } from "react";
import Card from "./lib/Card";
import pb from "./lib/pocketbase";
import "./styles.sass";

const Sidebar = () => {
	const items = [
		{ label: "HOME", href: "/" },
		{
			label: "PLAYLISTS",
			href: "/playlists",
			subItems: ["JAMS", "WORKOUT", "BACKGROUND", "CHILL", "JAZZ"],
		},
		{ label: "SETTINGS", href: "/settings" },
		{ label: "MY ACCOUNT", href: "/myaccount" },
	];

	return (
		<div className="sidebar">
			<a href="/" className="logo-container" data-home="true">
				<img src="dark-logo.svg" alt="logo" className="logo" />
			</a>
			<hr className="logo-line" />
			{items.map((item, index) => (
				<div key={index}>
					<div className="sidebar-item">
						<a href={item.href}>{item.label}</a>
					</div>
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

const tracks = await pb
	.collection("tracks")
	.getFullList({ sort: "-created", expand: "users(name).author" } as any);

const Main = () => {
	const [currentTrack, setCurrentTrack] = useState(null);

	return (
		<div className="main">
			<div className="header">
				<h1>Home</h1>
			</div>
			<div className="card-container">
				{tracks.map((track, index) => (
					<Card
						key={track.id}
						track={track}
						currentTrack={currentTrack}
						setCurrentTrack={setCurrentTrack}
					/>
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
