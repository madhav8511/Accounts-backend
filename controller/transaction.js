const model = require('../model/transaction');
const Transaction = model.Transaction;

exports.getAlltransaction = async (req,res)=>{
    const trans = await Transaction.find();
    res.json(trans);
}

exports.getTransaction = async (req,res)=>{
    const trans = await Transaction.findById(req.params.id);
    res.json(trans);
}

exports.createTransaction = async (req,res)=>{
    try {
        const { amount, description, type, img } = req.body;
        const trans = new Transaction({
            user: req.user.id,
            amount,
            description,
            type,
            images: img
        });

        await trans.save();
        res.json(trans);
    } catch (error) {
        console.error('Error creating transaction:', error);
        res.status(500).json({ error: 'Server error' });
    }
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