<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use App\Models\Income;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class ExpenseController extends Controller
{
    /**
     * Display a listing of the resource for dashboard.
     */
    public function index()
    {
        $expenses = Expense::orderBy('created_at', 'desc')->get();
        $incomes = Income::orderBy('created_at', 'desc')->get();
        
        // Calculate statistics
        $totalExpenses = $expenses->sum('amount');
        $totalIncome = Income::sum('amount');
        $currentBalance = $totalIncome - $totalExpenses;
        
        // Get monthly data for chart (last 6 months)
        $monthlyData = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthExpenses = Expense::whereYear('created_at', $date->year)
                ->whereMonth('created_at', $date->month)
                ->sum('amount');
            
            $monthlyData->push([
                'month' => $date->format('M'),
                'amount' => (float) $monthExpenses
            ]);
        }
        
        // Get category data for pie chart
        $categoryData = Expense::selectRaw('category, SUM(amount) as total')
            ->groupBy('category')
            ->get()
            ->map(function ($item) {
                return [
                    'category' => $item->category,
                    'amount' => (float) $item->total
                ];
            });

        return Inertia::render('Expenses/Index', [
            'expenses' => $expenses,
            'incomes' => $incomes,
            'stats' => [
                'totalExpenses' => (float) $totalExpenses,
                'totalIncome' => (float) $totalIncome,
                'currentBalance' => (float) $currentBalance,
                'transactionCount' => $expenses->count(),
            ],
            'monthlyData' => $monthlyData,
            'categoryData' => $categoryData,
            'flash' => session()->get('flash') ?? [],
        ]);
    }

    public function analytics()
    {
        $expenses = Expense::orderBy('created_at', 'desc')->get();
        $incomes = Income::orderBy('created_at', 'desc')->get();
        
        // Calculate statistics
        $totalExpenses = $expenses->sum('amount');
        $totalIncome = Income::sum('amount');
        $currentBalance = $totalIncome - $totalExpenses;

        return Inertia::render('Analytics/Index', [
            'expenses' => $expenses,
            'incomes' => $incomes,
            'stats' => [
                'totalExpenses' => (float) $totalExpenses,
                'totalIncome' => (float) $totalIncome,
                'currentBalance' => (float) $currentBalance,
                'transactionCount' => $expenses->count(),
            ],
        ]);
    }

    /**
     * Display dedicated transactions page.
     */
    public function transactions()
    {
        $expenses = Expense::orderBy('created_at', 'desc')->get();
        $incomes = Income::orderBy('created_at', 'desc')->get();
        
        // Calculate statistics
        $totalExpenses = $expenses->sum('amount');
        $totalIncome = Income::sum('amount');
        $currentBalance = $totalIncome - $totalExpenses;
        
        return Inertia::render('Transactions/Index', [
            'expenses' => $expenses,
            'incomes' => $incomes,
            'stats' => [
                'totalExpenses' => (float) $totalExpenses,
                'totalIncome' => (float) $totalIncome,
                'currentBalance' => (float) $currentBalance,
                'transactionCount' => $expenses->count() + $incomes->count(),
            ],
            'flash' => $this->getFlashMessages(),
        ]);
    }

    /**
     * Store a newly created expense.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
            'category' => 'required|string|in:Food,Transport,Entertainment,Health,Shopping,Other',
        ]);

        Expense::create($request->only('title', 'amount', 'category'));

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Expense added successfully!'
        ]);
    }

    /**
     * Add balance/income.
     */
    public function addBalance(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0'
        ]);

        // Create the income record
        Income::create([
            'title' => $validated['title'],
            'amount' => $validated['amount']
        ]);

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Income added successfully!'
        ]);
    }

    /**
     * Get incomes via API.
     */
    public function getIncomes()
    {
        $incomes = Income::orderBy('created_at', 'desc')->get();
        return response()->json($incomes);
    }

    /**
     * Remove the specified expense.
     */
    public function destroy(Expense $expense)
    {
        $expense->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Expense deleted successfully!'
        ]);
    }

    /**
     * Remove the specified income.
     */
    public function destroyIncome(Income $income)
    {
        $income->delete();

        return redirect()->back()->with('flash', [
            'type' => 'success',
            'message' => 'Income deleted successfully!'
        ]);
    }

    /**
     * Get flash messages in consistent format.
     */
    private function getFlashMessages()
    {
        $flash = session()->get('flash');
        if (!$flash) {
            return [];
        }

        // Ensure flash is in array format
        if (!is_array($flash)) {
            return [];
        }

        // If it's a single flash message, wrap it in array
        if (isset($flash['type']) && isset($flash['message'])) {
            return [$flash];
        }

        return $flash;
    }
}