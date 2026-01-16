import { useSyncExternalStore } from "react"
import { getMediaQuerySnapshot, subscribeMediaQuery } from "@/lib/client-subscriptions"

export function useMediaQuery(query: string) {
    const getServerSnapshot = () => {
        return false
    }

    // SSR safe implementation
    return useSyncExternalStore(
        (callback) => subscribeMediaQuery(query, callback),
        () => getMediaQuerySnapshot(query),
        getServerSnapshot
    )
}
