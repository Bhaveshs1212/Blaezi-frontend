import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { fetchDsaProblems, getUserProgress, createOrUpdateProgress } from "../services/dsaService";
import { useAuth } from "./AuthContext";

const DsaContext = createContext();

export function DsaProvider({ children }) {
  console.log('[DsaProvider] RENDER');
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data function (extracted for reuse)
  const loadData = useCallback(async () => {
    try {
      console.log('[DsaContext] loadData: Starting...');
      setLoading(true);
      // Fetch all problems from catalog (Striver SDE Sheet)
      const response = await fetchDsaProblems({ source: 'striver' });
      console.log('[DsaContext] loadData: Fetched problems response:', response);
      // Handle response: could be array directly or {success, data: [...]}
      const allProblems = Array.isArray(response) ? response : (response?.data || []);
      console.log('[DsaContext] loadData: All problems:', Array.isArray(allProblems) ? `Array with ${allProblems.length} items` : typeof allProblems);
      
      // Log first problem to see its structure
      if (allProblems.length > 0) {
        console.log('[DsaContext] ⚠️ FIRST PROBLEM STRUCTURE:', JSON.stringify(allProblems[0], null, 2));
      }
      
      // Fetch user's progress (requires auth)
      try {
        console.log('[DsaContext] loadData: Fetching user progress...');
        const progressResponse = await getUserProgress();
        console.log('[DsaContext] loadData: Progress response:', progressResponse);
        // Handle response: could be array directly or {success, data: []}
        const userProgress = Array.isArray(progressResponse) ? progressResponse : (progressResponse?.data || []);
        console.log('[DsaContext] loadData: User progress:', Array.isArray(userProgress) ? `Array with ${userProgress.length} items` : typeof userProgress);
        
        // Merge problems with user progress
        const mergedProblems = allProblems.map(problem => {
          console.log('[DsaContext] Problem fields:', Object.keys(problem), 'Sample:', { id: problem.id, _id: problem._id, title: problem.title });
          const progress = userProgress.find(p => p.problemId === problem._id || p.problemId === problem.id);
          return {
            ...problem,
            id: problem._id || problem.id,
            mongoId: problem._id, // Keep MongoDB ID separate
            status: progress?.status || 'none',
            notes: progress?.notes || '',
            lastSolvedAt: progress?.lastSolved || null
          };
        });
        
        console.log('[DsaContext] loadData: Setting merged problems, count:', mergedProblems.length);
        setProblems(mergedProblems);
      } catch (err) {
        // User not logged in or no progress yet - show all problems as 'none'
        console.log('[DsaContext] loadData: No user progress, showing all as none. Error:', err.message);
        const cleanProblems = allProblems.map(p => {
          console.log('[DsaContext] Problem fields (no auth):', Object.keys(p), 'Sample:', { id: p.id, _id: p._id, title: p.title });
          return {
            ...p,
            id: p._id || p.id,
            mongoId: p._id, // Keep MongoDB ID separate
            status: 'none'
          };
        });
        console.log('[DsaContext] loadData: Setting clean problems, count:', cleanProblems.length);
        setProblems(cleanProblems);
      }
    } catch (error) {
      console.error('[DsaContext] Error loading DSA data:', error);
    } finally {
      console.log('[DsaContext] loadData: Complete, setting loading to false');
      setLoading(false);
    }
  }, []);

  // Fetch problems and user progress from backend
  // Re-fetch when user authentication changes
  useEffect(() => {
    console.log('[DsaContext] useEffect: authLoading =', authLoading, 'isAuthenticated =', isAuthenticated);
    // Don't fetch data while auth is still loading
    if (authLoading) {
      console.log('[DsaContext] useEffect: Auth still loading, skipping data fetch');
      return;
    }
    
    // Auth is done loading - proceed with data fetch
    console.log('[DsaContext] useEffect: Auth complete, calling loadData()');
    loadData();
  }, [loadData, authLoading]);

  const updateProblemStatus = useCallback(async (id, status) => {
    console.log('[DsaContext] updateProblemStatus called with ID:', id, 'Status:', status);
    
    // Find the problem
    const problem = problems.find(p => String(p.id || p._id) === String(id));
    if (!problem) {
      console.error('[DsaContext] Problem not found with ID:', id);
      alert('Problem not found');
      return;
    }
    
    console.log('[DsaContext] Found problem:', problem.title);
    console.log('[DsaContext] Using problem ID:', id, '(custom string ID like "striver-1")');
    
    // Optimistically update UI first
    setProblems((prev) => {
      console.log('[DsaContext] Updating problems. Total problems:', prev.length);
      const updated = prev.map((p) => {
        // Compare IDs as strings to handle MongoDB ObjectIds
        const problemId = String(p.id || p._id);
        const targetId = String(id);
        
        if (problemId === targetId) {
          console.log('[DsaContext] Found matching problem:', p.title, 'Current status:', p.status, 'New status:', status);
          return {
            ...p,
            status,
            lastSolvedAt: new Date().toISOString(),
          };
        }
        return p;
      });
      console.log('[DsaContext] Optimistic update complete');
      return updated;
    });

    // Then persist to backend using the custom string ID
    try {
      console.log('[DsaContext] Saving to backend with custom ID:', id);
      const response = await createOrUpdateProgress({
        problemId: id,  // Use the custom string ID like "striver-1"
        status,
        lastSolved: new Date().toISOString()
      });
      console.log('[DsaContext] Backend save successful:', response);
    } catch (error) {
      console.error('[DsaContext] ❌ Error saving to backend:', error.message);
      console.error('[DsaContext] Full error:', error);
      console.error('[DsaContext] Error response:', error.response);
      
      let errorMessage = 'Failed to save problem status.';
      
      if (!error.response) {
        // Network error - backend not reachable
        errorMessage += ' Backend server is not reachable. Is it running on http://localhost:4000?';
      } else if (error.response.status === 401) {
        errorMessage += ' Please log in again.';
      } else if (error.response.status === 404) {
        errorMessage += ' API endpoint not found. Please check backend routes.';
      } else if (error.response.data?.message) {
        errorMessage += ' ' + error.response.data.message;
      }
      
      alert(errorMessage);
      
      // Reload data to get the correct state from backend
      loadData();
    }
  }, [loadData, problems]);

  const value = useMemo(
    () => ({ problems, updateProblemStatus, loading, refreshProblems: loadData }),
    [problems, updateProblemStatus, loading, loadData]
  );

  return (
    <DsaContext.Provider value={value}>
      {children}
    </DsaContext.Provider>
  );
}

export function useDsa() {
  return useContext(DsaContext);
}
