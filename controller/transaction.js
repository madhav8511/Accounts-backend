const model = require('../model/transaction');
const Transaction = model.Transaction;

exports.getAlltransaction = async (req,res)=>{
    const trans = await Transaction.find();
    res.json(trans);
}

exports.createTransaction = async (req,res)=>{
    const trans = new Transaction({user: req.user.id});

    trans.amount = req.body.amount;
    trans.description = req.body.description;
    trans.type = req.body.type;

    await trans.save();
    res.json(trans);
}

exports.getTransactionbyUser = async (req, res) => {
    try {
        const trans = await Transaction.find({ user: req.user.id });
        let credit = 0;
        let debit = 0;

        // Calculate credit and debit totals
        for (let i = 0; i < trans.length; i++) {
            if (trans[i].type === "credit") {
                credit += trans[i].amount;
            } else {
                debit += trans[i].amount;
            }
        }

        // Calculate balance
        let balance = credit - debit;

        // Prepare the response object
        const responseData = {
            credit: credit,
            debit: debit,
            balance: balance,
            transactions: trans
        };
        res.json(responseData);
    } catch (error) {
        // Handle errors
        console.error("Error:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

exports.deleteTransactionbyUser = async (req,res)=>{
    const trans = await Transaction.findByIdAndDelete(req.params.id);
    res.json({success : "Deleted Successfully"});
}