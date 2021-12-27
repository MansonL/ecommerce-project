
interface LogSignHeaderProps {
    type: string;
}

export function LogSignHeader(props: LogSignHeaderProps){
    return (
         <header>
         <div className="title">
        <h4>{`${props.type === 'login' ? "Log in" : "Sign up"}`}</h4>
        <div>
        <span>{`${props.type === 'login' ? 
        `Don't you have an account? Please, sign up in ` : 
        `Do you already have an account? Please, log in `}`}<a href={props.type === 'login' ? "/signup" : "/login"}>here</a></span>
          </div>
      </div>
    </header>
    )
}