import { useNavigate } from "react-router-dom"

const FirstPage = () => {
    const navigate = useNavigate();
    const gotoMainPage = () =>{
        navigate("/mainpage");
    }

    return (
        <div className="flex flex-col w-[100%] min-h-[100%] bg-[rgb(19,20,21)]">
            <div className="flex flex-col pt-12 pl-12  font-bold w-fit place-items-center">
                <div className="text-white text-xl">TRADELOCKER</div>
                <div className="text-slate-400 text-lg">COPIER</div>
            </div>
            <div>
                <div className="flex flex-col place-items-center">
                    <div className="text-white pt-32 items-center text-7xl ali">
                        Build More Money With US
                    </div>
                    <div className="text-white mt-[200px] text-1.8xl px-7 py-3 bg-[rgb(57,97,255)] rounded-2xl cursor-pointer" onClick={gotoMainPage}>
                        Start Trading
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FirstPage