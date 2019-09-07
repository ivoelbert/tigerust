use std::result::Result;

use super::super::ast::tigerabs::*;
use super::tigerseman::*;

pub fn typecheck(exp: &Exp, type_env: &TypeEnviroment, value_env: &ValueEnviroment) -> Result<Tipo, TypeError> {
    use Tipo::*;
    use super::varexp::tipar_var;
    match exp {
        Exp {node: _Exp::AssignExp{var , exp: value_exp}, pos} => {
            let var_type = match tipar_var(var, *pos, type_env, value_env) {
                Ok(TInt(R::RO)) => return Err(TypeError::ReadOnlyAssignment(*pos)),
                Ok(tipo) => tipo,
                Err(type_error) => return Err(type_error)
            };
            let value_type = match type_exp(value_exp, type_env, value_env) {
                Ok(tipo) => tipo,
                Err(type_error) => return Err(type_error)
            };
            if var_type == value_type {
                Ok(TUnit)
            }
            else {
                Err(TypeError::TypeMismatch(*pos))
            }
        },
        _ => panic!("Mala delegacion en seman")
    }
}

pub fn translate(_exp: Exp) -> ExpInterm {
    ExpInterm::CONST(0)
}