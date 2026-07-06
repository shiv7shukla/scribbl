import Canvas from "@/components/canvas/Canvas";

const page = () => {
    return (
        <div className="min-h-screen w-full bg-amber-600 p-4">
            <div className="h-[8vh] max-w-[1600px] rounded-3xl bg-blue-400 "></div>
            <div className="mx-auto flex min-h-[85vh] max-w-[1600px] flex-col gap-4 p-4 lg:flex-row">
                <div className="order-2 lg:order-1 lg:flex-1 rounded-3xl bg-white/80 p-4 shadow-lg">
                {/* left panel */}
                </div>

                <div className="order-1 flex-1 rounded-3xl bg-white/90 p-4 shadow-lg lg:order-2 lg:flex-2">
                <Canvas />
                </div>

                <div className="order-3 lg:flex-1 rounded-3xl bg-white/80 p-4 shadow-lg">
                {/* right panel */}
                </div>
            </div>
        </div>
    );
};

export default page;
