use crate::ast::*;
use crate::tree::translate::*;

pub fn trans_exp(
    AST {node, ..}: &AST,
    level: Level,
    value_env: &ValueEnviroment,
    breaks_stack: &Vec<Option<Label>>,
    frags: Vec<Fragment>,
) -> Result<(Tree::AST, Level, Vec<Fragment>), TransError> {
    match node {
        Exp::Array { size, init, .. } => {
            let (init_exp, init_level, init_frags) = super::trans_exp(init, level, value_env, breaks_stack, frags)?;
            let (size_exp, size_level, size_frags) = super::trans_exp(size, init_level, value_env, breaks_stack, init_frags)?;
            if let EnvEntry::Func {label, ..} = value_env.get("allocArray").expect("should be in initial value env") {
                Ok((
                    // This returns the memory address of the malloc result
                    Frame::external_call(*label, vec![size_exp, init_exp]),
                    size_level,
                    size_frags,
                ))
            }
            else {
                panic!("external function not found");
            }
        }
        _ => panic!(),
    }
}
