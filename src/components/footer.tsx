"use client";

import { useEffect, useState } from "react";

export default function Footer() {
    const catFacts = [
        "cats can jump up to 6 times their body length.",
        "a group of cats is called a clowder.",
        "cats have 32 muscles in each ear.",
        "most cats have no eyelashes.",
        "they sleep 12-16 hours a day. lazy legends.",
        "a cat's nose print is unique, like a fingerprint.",
        "their purring can help heal bones - seriously.",
        "cats sweat only through their paw pads.",
        "they can rotate their ears 180 degrees.",
        "whiskers help them detect air movement.",
        "male cats are usually left-pawed, females right-pawed.",
        "their meows are mostly for humans, not other cats.",
        "the oldest cat ever lived to 38 years.",
        "house cats share 95.6% of their dna with tigers.",
        "kittens lose their baby teeth just like humans.",
        "they can't taste sweetness.",
        "when cats blink slowly at you, it's a cat kiss.",
        "some cats are lactose intolerant - no milk for them.",
        "their back legs are longer than their front ones.",
        "a cat named stubbs was mayor of a town in alaska.",
    ];

    const [fact, setFact] = useState("");

    function getRandomFact() {
        return catFacts[Math.floor(Math.random() * catFacts.length)];
    }

    useEffect(() => {
        setFact(() => getRandomFact());
    }, []);

    return (
        <div className="w-full text-sm flex flex-col text-muted-foreground md:flex-row gap-8 md:gap-0 max-w-7xl px-4 md:px-6 mx-auto py-6 justify-between">
            <div className="flex flex-col gap-1">
                <span>
                    open source on{" "}
                    <a
                        href="https://github.com/drawcat-lol/app"
                        className="underline underline-offset-2"
                        target="_blank"
                    >
                        github
                    </a>
                </span>

                <button
                    className="cursor-pointer"
                    onClick={() => setFact(getRandomFact())}
                >
                    {fact}
                </button>
            </div>
            <div className="flex flex-col gap-1 items-end">
                <span>© 2025 drawcat.lol</span>
                <span>
                    made with ♥️ by{" "}
                    <a
                        className="underline underline-offset-2"
                        href="https://ronykax.xyz"
                        target="_blank"
                    >
                        ronykax
                    </a>
                </span>
            </div>
        </div>
    );
}
