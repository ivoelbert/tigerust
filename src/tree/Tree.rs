use super::Label;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Exp {
    CONST(i32),
    NAME(Label),
    TEMP(Label),
    BINOP(BinOp, Box<Exp>, Box<Exp>),
    MEM(Box<Exp>),
    CALL(Box<Exp>, Vec<Exp>),
    ESEQ(Box<Stm>, Box<Exp>)
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum Stm {
    EXP(Box<Exp>),
    MOVE(Box<Exp>, Box<Exp>),
    JUMP(Exp, Vec<Label>),
    CJUMP(RelOp, Exp, Exp, Label, Label),
    SEQ(Box<Stm>, Box<Stm>),
    LABEL(Label)
}

pub type Cond = Box<dyn Fn(Label, Label) -> Stm>;

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum BinOp {
    PLUS,
    MINUS,
    MUL,
    DIV,
    AND,
    OR,
    LSHIFT,
    RSHIFT,
    ARSHIFT,
    XOR
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub enum RelOp {
    EQ,
    NE,
    LT,
    GT,
    LE,
    GE,
    ULT,
    ULE,
    UGT,
    UGE
}

pub fn not_rel(ro : &RelOp) -> RelOp {
    use RelOp::*;
    match ro {
        EQ => NE,
	    NE => EQ,
	    LT => GE,
	    GE => LT,
	    GT => LE,
	    LE => GT,
	    ULT => UGE,
	    UGE => ULT,
	    ULE => UGT,
	    UGT => ULE,
    }
}

pub fn seq(mut stms: Vec<Stm>) -> Stm {
    let maybe_stm = stms.pop();
    match maybe_stm {
        Some(s) => Stm::SEQ(Box::new(s), Box::new(seq(stms))),
        None => Stm::EXP(Box::new(Exp::CONST(0))),
    }
}