import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import useAuth from "./useAuth";
import {
  addToWatchlist as addApi,
  removeFromWatchlist as removeApi,
  checkInWatchlist as checkApi,
} from "../api/user";

const useWatchlist = (movieId) => {
  const { user } = useAuth();
  const [inWatchlist, setInWatchlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!user || !movieId) {
      setInWatchlist(false);
      setChecking(false);
      return;
    }

    let mounted = true;
    setChecking(true);

    checkApi(movieId)
      .then((res) => {
        if (mounted) setInWatchlist(res.inWatchlist);
      })
      .catch(() => {
        if (mounted) setInWatchlist(false);
      })
      .finally(() => {
        if (mounted) setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, [user, movieId]);

  const toggleWatchlist = useCallback(async () => {
    if (!user) {
      toast.error("Please sign in to manage your watchlist");
      return;
    }

    if (!movieId) return;

    setLoading(true);

    try {
      if (inWatchlist) {
        await removeApi(movieId);
        setInWatchlist(false);
        toast.success("Removed from watchlist");
      } else {
        await addApi(movieId);
        setInWatchlist(true);
        toast.success("Added to watchlist");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to update watchlist";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [user, movieId, inWatchlist]);

  return { inWatchlist, loading, checking, toggleWatchlist };
};

export default useWatchlist;
