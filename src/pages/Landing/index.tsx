import { useEffect, useRef } from "react";
import PageLayout from "../../layouts/PageLayout";

export default function Landing() {
  const optionsRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    document.title = "ACT Labs | Home";
  }, []);

  return (
    <PageLayout heading="">
      <div className="flex flex-col gap-20 pb-4">
        <div className="flex items-center justify-center">
          {/* <div className="relative w-full">
            <div className="absolute -top-48 left-24 h-[70vh] w-[70vh] animate-blob rounded-full bg-purple-600 opacity-30 mix-blend-multiply blur-xl filter dark:mix-blend-color"></div>
            <div className="animation-delay-2000 absolute top-48 left-24 h-[70vh] w-[70vh] animate-blob rounded-full bg-green-600 opacity-30 mix-blend-multiply blur-xl filter dark:mix-blend-color"></div>
            <div className="animation-delay-4000 absolute top-24 right-24 h-[70vh] w-[70vh] animate-blob rounded-full bg-sky-600 opacity-30 mix-blend-multiply blur-xl filter dark:mix-blend-color"></div>
            <div className="animation-delay-2000 absolute -top-48 right-24 h-[70vh] w-[70vh] animate-blob rounded-full bg-yellow-600 opacity-30 mix-blend-multiply blur-xl filter dark:mix-blend-color"></div>

          </div> */}
          <div className="relative">
            <div className="bg-hidden animate-gradient-x inline-block bg-linear-to-r from-indigo-500 from-10% via-sky-500 via-30% to-green-500 to-90% bg-clip-text text-transparent">
              <h1 className="pb-20 text-9xl font-bold">
                Head start your lab repros
              </h1>
              <p className="text-4xl text-slate-500">
                Build and deploy labs in minutes ⌚ get a head start with labs
                built and tested by AKS Ninjas 🥷
              </p>
            </div>
          </div>
        </div>
        <div
          className="grid grid-cols-1 gap-4 text-slate-100 xl:grid-cols-3"
          ref={optionsRef}
        >
          <div className="flex flex-col justify-between gap-10 rounded-sm bg-fuchsia-600 bg-linear-to-r from-blue-600 to-purple-600 p-4 dark:bg-fuchsia-600">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl">Setup Server</h2>
              <h1 className="text-3xl">🚀 Deploy Server on Docker or Azure</h1>
              <p className="text-lg">
                Register your subscription and let actlabs automatically manage
                a sever for you on Azure in your subscription or self host on
                docker.{" "}
              </p>
            </div>
            <div>
              <a
                href="https://dev.azure.com/Supportability/AzureContainers/_wiki/wikis/Containers%20Wiki/1280601/Getting-Started"
                target={"_blank"}
                className="w-fit rounded-full bg-slate-200 px-8 py-2 text-2xl whitespace-nowrap text-blue-700 hover:bg-slate-300 contrast-more:border"
              >
                Get Started
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-sm bg-linear-to-r from-sky-600 to-green-600 p-4 dark:bg-fuchsia-600">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl">Public Labs</h2>
              <h1 className="text-3xl">
                🏃 Start with public labs created by Ninjas
              </h1>
              <p className="text-lg">
                There are many labs built by AKS SMEs which cover common
                scenarios and emerging issues. You can use them as is or modify
                to match your requirements.
              </p>
            </div>
            <div>
              <a
                href="labs/publiclab"
                className="w-fit rounded-full bg-slate-200 px-8 py-2 text-2xl whitespace-nowrap text-blue-700 hover:bg-slate-300 contrast-more:border"
              >
                Check Out
              </a>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-10 rounded-sm bg-linear-to-r from-rose-500 to-pink-600 p-4 dark:bg-fuchsia-600">
            <div className="flex flex-col gap-6">
              <h2 className="text-xl">Build Your Own</h2>
              <h1 className="text-3xl">⚒️ Build your own Awesome Labs</h1>
              <p className="text-lg">
                None of the public labs work? You are quite unique. Build your
                own lab using builder and make it powerful by writing an
                extension script.
              </p>
            </div>
            <div>
              <a
                href="builder"
                className="w-fit rounded-full bg-slate-200 px-8 py-2 text-2xl whitespace-nowrap text-blue-700 hover:bg-slate-300 contrast-more:border"
              >
                Get to Work
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
