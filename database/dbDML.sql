-- ============================================
-- DailyBits: AI-Powered Python Practice Platform
-- Sample Data (PostgreSQL)
-- ============================================

\c dailybits;

-- ============================================
-- USER DATA
-- ============================================
INSERT INTO user_profile (email, first_name, last_name) VALUES
    ('ma.ruit@northeastern.edu', 'Elly', 'Ma'),
    ('zhang.shuyi1@husky.neu.edu', 'Susie', 'Zhang'),
    ('student@gmail.com', 'Northeastern', 'Student'),
    ('admin@gmail.com', 'Admin', 'User'),
    ('alex.chen@gmail.com', 'Alex', 'Chen'),
    ('maya.patel@gmail.com', 'Maya', 'Patel'),
    ('jordan.wells@gmail.com', 'Jordan', 'Wells'),
    ('sofia.garcia@gmail.com', 'Sofia', 'Garcia'),
    ('liam.brooks@gmail.com', 'Liam', 'Brooks'),
    ('amira.hassan@gmail.com', 'Amira', 'Hassan');

INSERT INTO user_auth (email, password, google_id) VALUES
    ('ma.ruit@northeastern.edu', 'hashed_password_1', NULL),
    ('zhang.shuyi1@husky.neu.edu', 'hashed_password_2', NULL),
    ('student@gmail.com', 'hashed_password_3', NULL),
    ('admin@gmail.com', 'admin_hashed_password', NULL),
    ('alex.chen@gmail.com', NULL, 'google-oauth2|10000001'),
    ('maya.patel@gmail.com', 'hashed_password_5', NULL),
    ('jordan.wells@gmail.com', NULL, 'google-oauth2|10000002'),
    ('sofia.garcia@gmail.com', 'hashed_password_7', NULL),
    ('liam.brooks@gmail.com', 'hashed_password_8', NULL),
    ('amira.hassan@gmail.com', NULL, 'google-oauth2|10000003');

INSERT INTO account (email, register_date, student_flag, admin_flag) VALUES
    ('ma.ruit@northeastern.edu', '2025-01-15', TRUE, FALSE),
    ('zhang.shuyi1@husky.neu.edu', '2025-01-20', TRUE, FALSE),
    ('student@gmail.com', '2025-02-10', TRUE, FALSE),
    ('admin@gmail.com', '2025-01-01', FALSE, TRUE),
    ('alex.chen@gmail.com', '2025-02-05', TRUE, FALSE),
    ('maya.patel@gmail.com', '2025-02-07', TRUE, FALSE),
    ('jordan.wells@gmail.com', '2025-02-08', TRUE, FALSE),
    ('sofia.garcia@gmail.com', '2025-02-12', TRUE, FALSE),
    ('liam.brooks@gmail.com', '2025-02-14', TRUE, FALSE),
    ('amira.hassan@gmail.com', '2025-02-16', TRUE, FALSE);

INSERT INTO token_blacklist (jti, email, expired_at) VALUES
    ('jti_001', 'admin@gmail.com', '2025-02-01 10:00:00'),
    ('jti_002', 'ma.ruit@northeastern.edu', '2025-02-02 09:15:00'),
    ('jti_003', 'zhang.shuyi1@husky.neu.edu', '2025-02-03 12:30:00'),
    ('jti_004', 'student@gmail.com', '2025-02-04 08:45:00'),
    ('jti_005', 'alex.chen@gmail.com', '2025-02-05 18:20:00'),
    ('jti_006', 'maya.patel@gmail.com', '2025-02-06 07:05:00'),
    ('jti_007', 'jordan.wells@gmail.com', '2025-02-07 22:10:00'),
    ('jti_008', 'sofia.garcia@gmail.com', '2025-02-08 11:55:00'),
    ('jti_009', 'liam.brooks@gmail.com', '2025-02-09 13:40:00'),
    ('jti_010', 'amira.hassan@gmail.com', '2025-02-10 16:25:00');

-- ============================================
-- PROBLEM DATA
-- ============================================
INSERT INTO problem (difficulty_level, problem_title, problem_description, starter_code, is_published, estimate_time_baseline) VALUES
(
    'Easy',
    'Two Sum',
    $$Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]$$,
    $$def twoSum(nums: List[int], target: int) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    10
),
(
    'Easy',
    'Valid Palindrome',
    $$Return true if a string is a palindrome after removing non-alphanumeric characters and lowercasing.

Example:
Input: s = "A man, a plan, a canal: Panama"
Output: true$$,
    $$def isPalindrome(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    12
),
(
    'Easy',
    'Contains Duplicate',
    $$Given an integer array nums, return true if any value appears at least twice.

Example:
Input: nums = [1,2,3,1]
Output: true$$,
    $$def containsDuplicate(nums: List[int]) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    8
),
(
    'Medium',
    'Product of Array Except Self',
    $$Return an array answer such that answer[i] is the product of all the elements of nums except nums[i].

Example:
Input: nums = [1,2,3,4]
Output: [24,12,8,6]$$,
    $$def productExceptSelf(nums: List[int]) -> List[int]:
    # Write your code here
    pass$$,
    TRUE,
    20
),
(
    'Medium',
    'Coin Change',
    $$Return the fewest number of coins needed to make up a given amount, or -1 if impossible.

Example:
Input: coins = [1,2,5], amount = 11
Output: 3$$,
    $$def coinChange(coins: List[int], amount: int) -> int:
    # Write your code here
    pass$$,
    TRUE,
    25
),
(
    'Medium',
    'Valid Parentheses',
    $$Determine if the input string has valid matching brackets.

Example:
Input: s = "()[]{}"
Output: true$$,
    $$def isValid(s: str) -> bool:
    # Write your code here
    pass$$,
    TRUE,
    15
),
(
    'Medium',
    'Queue Using Stacks',
    $$Implement a FIFO queue using only two stacks.

Example:
Input: ["MyQueue","push","push","peek","pop","empty"], [[],[1],[2],[],[],[]]
Output: [null,null,null,1,1,false]$$,
    $$class MyQueue:
    def __init__(self):
        # Write your code here
        pass$$,
    FALSE,
    30
),
(
    'Hard',
    'Longest Substring Without Repeating Characters',
    $$Find the length of the longest substring without repeating characters.

Example:
Input: s = "abcabcbb"
Output: 3$$,
    $$def lengthOfLongestSubstring(s: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    35
),
(
    'Hard',
    'Edit Distance',
    $$Return the minimum number of operations required to convert one word to another.

Example:
Input: word1 = "horse", word2 = "ros"
Output: 3$$,
    $$def minDistance(word1: str, word2: str) -> int:
    # Write your code here
    pass$$,
    FALSE,
    40
),
(
    'Hard',
    'Maximum Depth of Binary Tree',
    $$Given the root of a binary tree, return its maximum depth.

Example:
Input: root = [3,9,20,null,null,15,7]
Output: 3$$,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    # Write your code here
    pass$$,
    TRUE,
    18
);

-- ============================================
-- SOLUTION DATA 
-- ============================================
INSERT INTO solution (problem_id, solution_code, solution_explanation, time_complexity, space_complexity, is_published) VALUES
(
    1,
    $$def twoSum(nums: List[int], target: int) -> List[int]:
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []$$,
    'Use a hash map to track complements in one pass.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    2,
    $$def isPalindrome(s: str) -> bool:
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]$$,
    'Normalize the string and compare with its reverse.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    3,
    $$def containsDuplicate(nums: List[int]) -> bool:
    return len(nums) != len(set(nums))$$,
    'A set removes duplicates; compare sizes.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    4,
    $$def productExceptSelf(nums: List[int]) -> List[int]:
    n = len(nums)
    result = [1] * n
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    return result$$,
    'Prefix and suffix products avoid division.',
    'O(n)',
    'O(1) excluding output array',
    TRUE
),
(
    5,
    $$def coinChange(coins: List[int], amount: int) -> int:
    dp = [amount + 1] * (amount + 1)
    dp[0] = 0
    for a in range(1, amount + 1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a - c])
    return -1 if dp[amount] == amount + 1 else dp[amount]$$,
    'Bottom-up DP builds minimum coins for each amount.',
    'O(n * m)',
    'O(n)',
    TRUE
),
(
    6,
    $$def isValid(s: str) -> bool:
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack$$,
    'Use a stack to validate bracket matching.',
    'O(n)',
    'O(n)',
    TRUE
),
(
    7,
    $$class MyQueue:
    def __init__(self):
        self.in_stack = []
        self.out_stack = []

    def push(self, x: int) -> None:
        self.in_stack.append(x)

    def _shift(self) -> None:
        if not self.out_stack:
            while self.in_stack:
                self.out_stack.append(self.in_stack.pop())

    def pop(self) -> int:
        self._shift()
        return self.out_stack.pop()

    def peek(self) -> int:
        self._shift()
        return self.out_stack[-1]

    def empty(self) -> bool:
        return not self.in_stack and not self.out_stack$$,
    'Transfer from input to output stack when needed.',
    'O(1) amortized',
    'O(n)',
    FALSE
),
(
    8,
    $$def lengthOfLongestSubstring(s: str) -> int:
    seen = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        best = max(best, right - left + 1)
    return best$$,
    'Sliding window with last-seen indices.',
    'O(n)',
    'O(min(n, alphabet))',
    FALSE
),
(
    9,
    $$def minDistance(word1: str, word2: str) -> int:
    n, m = len(word1), len(word2)
    dp = [[0] * (m + 1) for _ in range(n + 1)]
    for i in range(n + 1):
        dp[i][0] = i
    for j in range(m + 1):
        dp[0][j] = j
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if word1[i - 1] == word2[j - 1]:
                dp[i][j] = dp[i - 1][j - 1]
            else:
                dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
    return dp[n][m]$$,
    'Classic DP on prefixes of both strings.',
    'O(n * m)',
    'O(n * m)',
    FALSE
),
(
    10,
    $$def maxDepth(root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))$$,
    'Recursive DFS returns maximum depth.',
    'O(n)',
    'O(h)',
    TRUE
);

-- ============================================
-- ALGORITHM TAGS 
-- ============================================
INSERT INTO algorithm (algorithm_name) VALUES
    ('Array'),
    ('String'),
    ('Hash Table'),
    ('Dynamic Programming'),
    ('Two Pointers'),
    ('Stack'),
    ('Queue'),
    ('Sliding Window'),
    ('Tree'),
    ('Greedy');

INSERT INTO problem_algorithm (problem_id, algorithm_id) VALUES
    (1, 1),
    (1, 3),
    (2, 2),
    (2, 5),
    (3, 3),
    (4, 1),
    (5, 4),
    (6, 6),
    (7, 7),
    (8, 8),
    (9, 4),
    (10, 9);

-- ============================================
-- SUBMISSIONS 
-- ============================================
INSERT INTO submission (problem_id, account_number, submitted_code, is_correct, submitted_at) VALUES
    (1, 1, $$def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target-num], i]
        seen[num] = i$$, TRUE, '2025-02-10 10:30:00'),
    (2, 2, $$def isPalindrome(s):
    cleaned = "".join(c.lower() for c in s if c.isalnum())
    return cleaned == cleaned[::-1]$$, TRUE, '2025-02-11 14:08:00'),
    (3, 3, $$def containsDuplicate(nums):
    return len(set(nums)) != len(nums)$$, TRUE, '2025-02-12 09:12:00'),
    (4, 4, $$def productExceptSelf(nums):
    n = len(nums)
    res = [1]*n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n-1,-1,-1):
        res[i] *= right
        right *= nums[i]
    return res$$, TRUE, '2025-02-13 16:18:00'),
    (5, 5, $$def coinChange(coins, amount):
    dp = [amount+1]*(amount+1)
    dp[0] = 0
    for a in range(1, amount+1):
        for c in coins:
            if a - c >= 0:
                dp[a] = min(dp[a], 1 + dp[a-c])
    return -1 if dp[amount] == amount+1 else dp[amount]$$, TRUE, '2025-02-14 11:55:00'),
    (6, 6, $$def isValid(s):
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    for ch in s:
        if ch in pairs.values():
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack$$, TRUE, '2025-02-15 13:17:00'),
    (7, 7, $$class MyQueue:
    def __init__(self):
        self.a = []
        self.b = []
    def push(self, x):
        self.a.append(x)
    def pop(self):
        if not self.b:
            while self.a:
                self.b.append(self.a.pop())
        return self.b.pop()$$, FALSE, '2025-02-16 09:45:00'),
    (8, 8, $$def lengthOfLongestSubstring(s):
    seen = {}
    left = 0
    ans = 0
    for right, ch in enumerate(s):
        if ch in seen and seen[ch] >= left:
            left = seen[ch] + 1
        seen[ch] = right
        ans = max(ans, right - left + 1)
    return ans$$, TRUE, '2025-02-17 17:25:00'),
    (9, 9, $$def minDistance(a, b):
    n, m = len(a), len(b)
    dp = [[0]*(m+1) for _ in range(n+1)]
    for i in range(n+1):
        dp[i][0] = i
    for j in range(m+1):
        dp[0][j] = j
    for i in range(1, n+1):
        for j in range(1, m+1):
            if a[i-1] == b[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])
    return dp[n][m]$$, TRUE, '2025-02-18 09:05:00'),
    (10, 10, $$def maxDepth(root):
    if not root:
        return 0
    return 1 + max(maxDepth(root.left), maxDepth(root.right))$$, TRUE, '2025-02-19 10:10:00');

-- ============================================
-- STUDY PLAN DATA 
-- ============================================
INSERT INTO study_plan (account_number, plan_name, time_available, created_at, is_accepted) VALUES
    (1, 'DP Essentials', 6, '2025-02-10 12:00:00', TRUE),
    (2, 'String Sprint', 4, '2025-02-11 12:30:00', TRUE),
    (3, 'Hashing Basics', 3, '2025-02-12 12:45:00', TRUE),
    (4, 'Arrays in Depth', 5, '2025-02-13 13:10:00', FALSE),
    (5, 'Stacks & Queues', 4, '2025-02-14 13:20:00', TRUE),
    (6, 'Two Pointers Bootcamp', 3, '2025-02-15 13:35:00', TRUE),
    (7, 'Sliding Window Week', 5, '2025-02-16 13:50:00', FALSE),
    (8, 'Tree Traversals', 5, '2025-02-17 14:05:00', TRUE),
    (9, 'Greedy Warmup', 3, '2025-02-18 14:20:00', TRUE),
    (10, 'Interview Mix', 7, '2025-02-19 14:35:00', FALSE);

INSERT INTO study_plan_problems (plan_id, problem_id, estimate_time_assigned) VALUES
    (1, 5, 25),
    (1, 4, 20),
    (2, 2, 12),
    (3, 3, 8),
    (4, 1, 10),
    (5, 6, 15),
    (6, 2, 12),
    (7, 8, 35),
    (8, 10, 18),
    (9, 4, 20);

INSERT INTO study_plan_algorithm (plan_id, algorithm_id) VALUES
    (1, 4),
    (2, 2),
    (3, 3),
    (4, 1),
    (5, 6),
    (6, 5),
    (7, 8),
    (8, 9),
    (9, 10),
    (10, 1);

INSERT INTO study_plan_difficulty (plan_id, difficulty_level) VALUES
    (1, 'Medium'),
    (2, 'Easy'),
    (3, 'Easy'),
    (4, 'Medium'),
    (5, 'Medium'),
    (6, 'Easy'),
    (7, 'Hard'),
    (8, 'Hard'),
    (9, 'Easy'),
    (10, 'Medium');

-- ============================================
-- CHAT QUERY DATA 
-- ============================================
INSERT INTO chat_query (account_number, user_message, ai_response, created_at) VALUES
    (1, 'I have 2 hours today. What should I practice?', 'Let''s focus on two medium DP problems and one easy warmup.', '2025-02-10 09:30:00'),
    (2, 'Give me a quick string problem.', 'Try Valid Palindrome and aim for a linear solution.', '2025-02-11 10:10:00'),
    (3, 'I want to work on hash tables.', 'Start with Contains Duplicate, then Two Sum.', '2025-02-12 08:50:00'),
    (4, 'Can you suggest an array problem?', 'Product of Array Except Self is a great fit.', '2025-02-13 09:20:00'),
    (5, 'Help me with stacks.', 'Valid Parentheses is a solid place to begin.', '2025-02-14 11:00:00'),
    (6, 'I want an easy two pointers exercise.', 'Try a palindrome check with two pointers.', '2025-02-15 12:05:00'),
    (7, 'Any sliding window practice?', 'Longest Substring Without Repeating Characters is perfect.', '2025-02-16 13:15:00'),
    (8, 'I need a hard tree problem.', 'Maximum Depth is a warmup before harder tree problems.', '2025-02-17 14:25:00'),
    (9, 'Give me a greedy warmup.', 'Try picking intervals and sorting by end time.', '2025-02-18 15:35:00'),
    (10, 'Build me a mixed plan.', 'I''ll mix arrays, strings, and DP across the week.', '2025-02-19 16:45:00');

-- ============================================
-- TODO ITEMS 
-- ============================================
INSERT INTO todo_item (account_number, problem_id, plan_id, source, added_at) VALUES
    (1, 5, 1, 'study_plan', '2025-02-10 12:05:00'),
    (1, 4, 1, 'study_plan', '2025-02-10 12:05:00'),
    (2, 2, 2, 'study_plan', '2025-02-11 12:35:00'),
    (3, 3, 3, 'study_plan', '2025-02-12 12:50:00'),
    (4, 1, NULL, 'manual', '2025-02-13 09:25:00'),
    (5, 6, 5, 'study_plan', '2025-02-14 13:25:00'),
    (6, 2, NULL, 'manual', '2025-02-15 12:10:00'),
    (7, 8, 7, 'study_plan', '2025-02-16 13:55:00'),
    (8, 10, 8, 'study_plan', '2025-02-17 14:10:00'),
    (9, 4, 9, 'study_plan', '2025-02-18 14:25:00');

-- ============================================
-- STUDY NOTES 
-- ============================================
INSERT INTO study_note (todo_id, account_number, note_content, created_at, updated_at) VALUES
    (1, 1, 'Focus on dp array initialization and base cases.', '2025-02-10 12:10:00', '2025-02-10 12:10:00'),
    (2, 1, 'Remember prefix and suffix products.', '2025-02-10 12:12:00', '2025-02-10 12:12:00'),
    (3, 2, 'Two pointers after normalization.', '2025-02-11 12:40:00', '2025-02-11 12:40:00'),
    (4, 3, 'Use a set to detect duplicates.', '2025-02-12 12:55:00', '2025-02-12 12:55:00'),
    (5, 4, 'Brute force first, then optimize.', '2025-02-13 09:30:00', '2025-02-13 09:30:00'),
    (6, 5, 'Stack of opening brackets.', '2025-02-14 13:30:00', '2025-02-14 13:30:00'),
    (7, 6, 'Sliding window vs two pointers?', '2025-02-15 12:15:00', '2025-02-15 12:15:00'),
    (8, 7, 'Queue via two stacks: amortized O(1).', '2025-02-16 14:00:00', '2025-02-16 14:00:00'),
    (9, 8, 'Tree depth via DFS recursion.', '2025-02-17 14:15:00', '2025-02-17 14:15:00'),
    (10, 9, 'Revisit greedy strategies next week.', '2025-02-18 14:30:00', '2025-02-18 14:30:00');
