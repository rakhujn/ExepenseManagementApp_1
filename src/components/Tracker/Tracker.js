import React from 'react';
import fire from '../../config/Fire';
import '../Tracker/Tracker.css';
import Transaction from './Transaction/Transaction'

export default class Tracker extends React.Component {

    state = {
        transactions: [],
        money: 0,
        transactionName: "",
        transactionType: "",
        price: '',
        currentUID: fire.auth().currentUser.uid
    }

    logout = () => {
        fire.auth().signOut()
    }

    handleChange = input => e => {
        this.setState({
            [input]: e.target.value !== "0" ? e.target.value : ""
        })
    }

    addNewTransaction = () => {
        const { transactionName, transactionType, price, money, currentUID } = this.state
        if (transactionName && transactionType && price) {
            const BackUpState = this.state.transactions
            BackUpState.push({
                id: BackUpState.length + 1,
                name: transactionName,
                type: transactionType,
                price: price,
                user_id: currentUID
            })
            fire.database().ref("Transactions/" + currentUID).push({
                id: BackUpState.length,
                name: transactionName,
                type: transactionType,
                price: price,
                user_id:currentUID
            }).then((data)=>{
                console.log('success callback')
                this.setState({
                    transactions:BackUpState,
                    money:transactionType=="deposit"?money+parseFloat(price):money-parseFloat(price),
                    transactionName:'',
                    transactionType:"",
                    price:""
                })
            }).catch((e)=>{
                console.log(e.message)
            })
        }

    }

    componentDidMount(){
        const {currentUID,money}=this.state
        let totalMoney=money;
        const BackUpState=this.state.transactions;
        fire.database().ref("Transactions/"+currentUID).once("value",
        (s)=>{
            s.forEach((a)=>{
                totalMoney=
                a.val().type==='deposit'?
                parseFloat(a.val().price)+totalMoney
                :totalMoney-parseFloat(a.val().price)

                BackUpState.push({
                    id:a.val().id,
                    name:a.val().name,
                    type:a.val().type,
                    price:a.val().price,
                    user_id:a.val().user_id,
                })
            })

            this.setState({
                transactions:BackUpState,
                money:totalMoney
            })
        })

    }
    render() {
        var currentUser = fire.auth().currentUser
        return (
            <div className='trackerBlock'>
                <div className='welcome'>
                    <span>Hi, {currentUser.displayName}!</span>
                    <button className='exit' onClick={this.logout}>Exit</button>
                </div>
                <div className='totalMoney'>{this.state.money}</div>
                <div className='newTransactionBlock'>
                    <div className='newTransaction'>
                        <form>
                            <input
                                placeholder='Transaction Name'
                                type="text"
                                name='transactionName'
                                value={this.state.transactionName}
                                onChange={this.handleChange('transactionName')}
                            />
                            <div className='inputGroup'>
                                <select name='type'
                                    value={this.state.transactionType}
                                    onChange={this.handleChange('transactionType')}>
                                    <option value={"0"}>Type</option>
                                    <option value={"expense"}>Expense</option>
                                    <option value={"deposit"}>Deposit</option>
                                </select>
                                <input
                                    placeholder='Price'
                                    type="text"
                                    name='price'
                                    value={this.state.price}
                                    onChange={this.handleChange('price')}
                                />
                            </div>
                        </form>
                        <button
                            className='addTransaction'
                            onClick={() => { this.addNewTransaction() }}>
                            + Add Transaction
                        </button>
                    </div>
                </div>
                <div className='latestTransactions'>
                    <p>Latest Transaction</p>
                    <ul>
                       {
                        Object.keys(this.state.transactions).map((id)=>(
                            <Transaction key={id}
                                type={this.state.transactions[id].type}
                                name={this.state.transactions[id].name}
                                price={this.state.transactions[id].price}
                            />
                        ))
                       }
                    </ul>
                </div>
            </div>
        )
    }
}