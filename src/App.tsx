import { useState } from 'react';
import './App.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { abi } from './assets/abis/MHTTokenAbi';
import { MHT_CONTRACT_ADDRESS } from './assets/constants';
import { toast } from 'react-toastify';

const DataInputComponent: React.FC<{ handleTransfer: (wallet: string, amount: number) => Promise<boolean>, isTransferring: boolean }> = ({ handleTransfer, isTransferring }) => {
  const [wallet, setWallet] = useState<string>('');
  const [amount, setAmount] = useState<number | ''>('');
  const [transferMessage, setTransferMessage] = useState<string>('');

  const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWallet(e.target.value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value === '' ? '' : parseInt(value));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (amount !== '') {
      const success = await handleTransfer(wallet, amount);
      if (success) {
        setWallet('');
        setAmount('');
        setTransferMessage(`Transferred ${amount} tokens to ${wallet}`);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="wallet">Wallet:</label>
          <input className='form-container input' type="text" id="wallet" value={wallet} onChange={handleWalletChange} />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input className='form-container input' type="number" id="amount" value={amount} onChange={handleAmountChange} />
        </div>
        <button type="submit" disabled={isTransferring}>Transfer</button>
      </form>
      {transferMessage && <p className="message">{transferMessage}</p>}
    </div>
  );
};

function App() {
  const [isTransferring, setIsTransferring] = useState(false);
  const { address, isConnected } = useAccount();
  const { data, isLoading, refetch } = useReadContract({
    abi,
    address: MHT_CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: [address],
  });
  const { writeContractAsync } = useWriteContract();

  const handleTransfer = async (wallet: string, amount: number): Promise<boolean> => {
    setIsTransferring(true);
    try {
      const txHash = await writeContractAsync({
        abi,
        address: MHT_CONTRACT_ADDRESS,
        functionName: 'transfer',
        args: [wallet, amount],
      });
      console.log('Transaction Hash:', txHash);
      toast.success(`Transferred ${amount} tokens to ${wallet}`);
      await refetch(); // Update the balance after the transfer
      setIsTransferring(false);
      return true; // Indicate success
    } catch (error) {
      console.error(error);
      toast.error('Failed to transfer tokens');
      setIsTransferring(false);
      return false; // Indicate failure
    }
  };

  return (
    <main className="main-container">
      <h1 className="header">MHT Token Transfers</h1>
      
       <div className="rainbow-connect-button">
       <ConnectButton
  accountStatus={{
    smallScreen: 'avatar',
    largeScreen: 'full',
  }}
/>
      </div>
      
      <div>
        {isConnected ? (
          <div>
            <p className="balance">
              💰 <span>Balance:</span>{' '}
              {isLoading ? <span className="opacity-50">Loading...</span> : data?.toString()}
            </p>

            <DataInputComponent handleTransfer={handleTransfer} isTransferring={isTransferring} />
          </div>
        ) : (
          <div>Please connect your wallet to use the faucet</div>
        )}
      </div>
    </main>
  );
}

export default App;
