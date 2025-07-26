import { Check, Flag } from "lucide-react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import useUserStore from "@/stores/user";
import { suapbase } from "@/lib/utils";
import { toast } from "sonner";

export default function ReportButton({ item }: { item: any }) {
    const { user } = useUserStore();
    const [reportDescription, setReportDescription] = useState("");

    async function handleReport(reporting: string) {
        if (user) {
            const { error } = await suapbase.from("reports").insert({
                description: reportDescription,
                from: user.id,
                reporting,
            });

            if (error) {
                toast.error("something went wrong! try again later.", {
                    richColors: true,
                });
            } else {
                toast.success("we've recieved your report!", {
                    richColors: true,
                });

                setReportDescription("");
            }
        } else {
            toast.warning("please log in first!", { richColors: true });
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                    <Flag />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="text-start">
                    <DialogTitle>report drawing</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <p className="text-muted-foreground text-sm">
                                you're about to report this user for submitting
                                a drawing that breaks the rules. drawings
                                usually get reported for reasons like:
                                <br />
                                <br />
                            </p>
                            <ul className="list-disc list-inside text-muted-foreground text-sm">
                                <li>it's NSFW</li>
                                <li>it's not a cat</li>
                                <li>it's a dog</li>
                                <li>it contains gore</li>
                            </ul>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <Textarea
                    placeholder="describe what's wrong with this drawing"
                    value={reportDescription}
                    onChange={(e) => setReportDescription(e.target.value)}
                />
                <DialogFooter>
                    <Button size={"lg"} onClick={() => handleReport(item.uid)}>
                        <Check />
                        submit
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
