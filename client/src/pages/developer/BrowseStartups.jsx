import { useEffect, useState } from "react";
import DeveloperStartupCard from "../../components/startup/DeveloperStartupCard.jsx";
import EmptyState from "../../components/ui/EmptyState.jsx";

import { getAllStartups } from "../../services/startup.service.js";

export default function BrowseStartups() {

    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadStartups();
    }, []);

    async function loadStartups() {

        try {

            const data = await getAllStartups();

            setStartups(data);

        } catch (err) {

            setError("Unable to load startups.");

        } finally {

            setLoading(false);

        }

    }

    return (

        <div className="mx-auto max-w-6xl">

        
            <main className="mx-auto max-w-6xl px-6 py-10">

                <span className="font-mono text-xs font-semibold uppercase tracking-widest text-cyan">
                    Developer
                </span>

                <h1 className="mt-2 font-display text-3xl font-bold text-paper">
                    Browse Startups
                </h1>

                <p className="mt-2 text-paper-dim">
                    Find startups that match your skills.
                </p>

                {error && (

                    <p className="mt-6 text-red-500">
                        {error}
                    </p>

                )}

                <div className="mt-8">

                    {

                        loading ?

                            (

                                <p>Loading...</p>

                            )

                            :

                            startups.length === 0 ?

                                (

                                    <EmptyState
                                        title="No startups available"
                                        body="There are currently no startups accepting developers."
                                    />

                                )

                                :

                                (

                                    <div className="grid gap-5 sm:grid-cols-2">

                                        {

                                            startups.map((startup) => (

                                                <DeveloperStartupCard
                                                 key={startup.id}
                                                startup={startup}
                                                />

                                            ))

                                        }

                                    </div>

                                )

                    }

                </div>

            </main>

        </div>

    );

}