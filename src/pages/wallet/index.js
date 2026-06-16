import React, { useState } from "react";
import Web3 from "web3";

import "./index.css";

import Header from "../../components/header";
import Footer from "../../components/footer";
import CoinImg from "../../assets/images/coin-img.png";

function Wallet() {
	const [web3, setWeb3] = useState(null);
	const [account, setAccount] = useState("");
	const [balance, setBalance] = useState("0");
	const [connecting, setConnecting] = useState(false);
	const [error, setError] = useState("");

	const [recipient, setRecipient] = useState("");
	const [amount, setAmount] = useState("");
	const [sending, setSending] = useState(false);
	const [txHash, setTxHash] = useState("");
	const [copied, setCopied] = useState(false);

	const refreshBalance = async (web3Instance, address) => {
		const wei = await web3Instance.eth.getBalance(address);
		setBalance(web3Instance.utils.fromWei(wei, "ether"));
	};

	const connectWallet = async () => {
		setError("");
		if (!window.ethereum) {
			setError("No wallet found. Please install MetaMask.");
			return;
		}
		try {
			setConnecting(true);
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			const web3Instance = new Web3(window.ethereum);
			setWeb3(web3Instance);
			setAccount(accounts[0]);
			await refreshBalance(web3Instance, accounts[0]);
		} catch (err) {
			setError(err.message || "Failed to connect wallet.");
		} finally {
			setConnecting(false);
		}
	};

	const handleSend = async (e) => {
		e.preventDefault();
		setError("");
		setTxHash("");

		if (!web3 || !account) {
			setError("Connect your wallet first.");
			return;
		}
		if (!web3.utils.isAddress(recipient)) {
			setError("Enter a valid recipient address.");
			return;
		}
		if (!amount || Number(amount) <= 0) {
			setError("Enter a valid amount.");
			return;
		}

		try {
			setSending(true);
			const receipt = await web3.eth.sendTransaction({
				from: account,
				to: recipient,
				value: web3.utils.toWei(amount, "ether"),
			});
			setTxHash(receipt.transactionHash);
			setRecipient("");
			setAmount("");
			await refreshBalance(web3, account);
		} catch (err) {
			setError(err.message || "Transaction failed.");
		} finally {
			setSending(false);
		}
	};

	const copyAddress = async () => {
		await navigator.clipboard.writeText(account);
		setCopied(true);
		setTimeout(() => setCopied(false), 1500);
	};

	const shortAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

	return (
		<div>
			<div className="header_section">
				<Header />
				<div className="wallet_hero">
					<div className="container">
						<h1 className="wallet_hero_title">
							Web3 <span style={{ color: "#02a763" }}>Wallet</span>
						</h1>
						<p className="wallet_hero_text">
							Connect your wallet to send and receive ETH securely.
						</p>
					</div>
				</div>
			</div>

			<div className="wallet_section layout_padding">
				<div className="container">
					{!account ? (
						<div className="wallet_card wallet_connect_card">
							<img src={CoinImg} alt="Wallet" className="wallet_connect_img" />
							<h2 className="wallet_card_title">Connect Your Wallet</h2>
							<p className="wallet_card_subtext">
								Connect MetaMask to view your balance and start sending or
								receiving ETH.
							</p>
							<div className="btn_main wallet_btn_main">
								<div className="started_bt active">
									<a onClick={connecting ? undefined : connectWallet}>
										{connecting ? "Connecting..." : "Connect Wallet"}
									</a>
								</div>
							</div>
						</div>
					) : (
						<div className="row">
							<div className="col-md-5">
								<div className="wallet_card wallet_balance_card">
									<span className="wallet_label">Total Balance</span>
									<span className="wallet_balance_value">
										{Number(balance).toFixed(5)}
										<small> ETH</small>
									</span>

									<div className="wallet_address_box">
										<span className="wallet_label">Receive at</span>
										<div className="wallet_address_row">
											<code title={account}>{shortAddress(account)}</code>
											<button
												type="button"
												className="wallet_copy_bt"
												onClick={copyAddress}
											>
												{copied ? "Copied!" : "Copy"}
											</button>
										</div>
									</div>
								</div>
							</div>

							<div className="col-md-7">
								<div className="wallet_card wallet_send_card">
									<h3 className="wallet_card_title">Send ETH</h3>
									<form onSubmit={handleSend}>
										<div className="wallet_form_group">
											<label>Recipient Address</label>
											<input
												type="text"
												className="wallet_input"
												placeholder="0x..."
												value={recipient}
												onChange={(e) => setRecipient(e.target.value)}
											/>
										</div>
										<div className="wallet_form_group">
											<label>Amount (ETH)</label>
											<input
												type="number"
												step="any"
												min="0"
												className="wallet_input"
												placeholder="0.0"
												value={amount}
												onChange={(e) => setAmount(e.target.value)}
											/>
										</div>
										<div className="btn_main wallet_btn_main">
											<div className="started_bt active">
												<a onClick={sending ? undefined : handleSend}>
													{sending ? "Sending..." : "Send ETH"}
												</a>
											</div>
										</div>
									</form>

									{txHash && (
										<p className="wallet_tx_success">
											Transaction sent:{" "}
											<a
												href={`https://sepolia.etherscan.io/tx/${txHash}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												{shortAddress(txHash)}
											</a>
										</p>
									)}
								</div>
							</div>
						</div>
					)}

					{error && <p className="wallet_error">{error}</p>}
				</div>
			</div>

			<Footer />
		</div>
	);
}


export default Wallet;
