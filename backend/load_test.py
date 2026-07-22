"""
Baseline & Load Testing Suite for NeuroVoiceCompanion API
-----------------------------------------------------------
Simulates concurrent virtual users over a specified duration to measure:
- Requests Per Second (RPS)
- Response Times (Min, Max, Avg, P95, P99)
- Error Rate & HTTP Status distributions
"""

import time
import math
import argparse
import urllib.request
import urllib.error
import json
from concurrent.futures import ThreadPoolExecutor, as_completed

# Default Configuration
DEFAULT_URL = "http://127.0.0.1:5000"
DEFAULT_USERS = 100
DEFAULT_DURATION = 60 # seconds

def send_request(base_url):
    """Sends a single request to the backend API and measures response time."""
    target_url = f"{base_url.rstrip('/')}/"
    start_time = time.perf_counter()
    success = False
    status_code = 0
    
    try:
        req = urllib.request.Request(target_url, headers={'User-Agent': 'LoadTester/1.0'})
        with urllib.request.urlopen(req, timeout=5) as response:
            status_code = response.status
            if status_code == 200:
                success = True
    except urllib.error.HTTPError as e:
        status_code = e.code
    except Exception as e:
        status_code = 0
        
    duration_ms = (time.perf_counter() - start_time) * 1000.0
    return success, duration_ms, status_code

def worker_task(base_url, stop_time, results):
    """Worker task simulating one Virtual User continuously making requests until stop_time."""
    while time.time() < stop_time:
        res = send_request(base_url)
        results.append(res)
        time.sleep(0.01) # minor delay to avoid overwhelming local socket loop

def run_load_test(base_url, virtual_users, duration_seconds):
    print(f"============================================================")
    print(f"       STARTING BASELINE / LOAD TEST                        ")
    print(f"============================================================")
    print(f"Target Base URL : {base_url}")
    print(f"Virtual Users   : {virtual_users} concurrent VUs")
    print(f"Duration        : {duration_seconds} seconds")
    print(f"Status          : Running...\n")

    results = []
    start_wall_time = time.time()
    stop_time = start_wall_time + duration_seconds

    with ThreadPoolExecutor(max_workers=virtual_users) as executor:
        futures = [
            executor.submit(worker_task, base_url, stop_time, results)
            for _ in range(virtual_users)
        ]
        for future in as_completed(futures):
            pass # Wait for all worker threads to finish

    end_wall_time = time.time()
    actual_duration = end_wall_time - start_wall_time

    if not results:
        print("No requests completed during the test window.")
        return

    # Metrics calculation
    total_requests = len(results)
    successful_requests = sum(1 for r in results if r[0])
    failed_requests = total_requests - successful_requests
    rps = total_requests / actual_duration if actual_duration > 0 else 0

    response_times = [r[1] for r in results]
    response_times.sort()

    min_rt = response_times[0]
    max_rt = response_times[-1]
    avg_rt = sum(response_times) / total_requests
    
    p95_index = math.floor(0.95 * total_requests)
    p99_index = math.floor(0.99 * total_requests)
    p95_rt = response_times[min(p95_index, total_requests - 1)]
    p99_rt = response_times[min(p99_index, total_requests - 1)]

    # Print Summary Report
    print("============================================================")
    print("                LOAD TEST SUMMARY RESULTS                   ")
    print("============================================================")
    print(f"Test Duration           : {actual_duration:.2f} seconds")
    print(f"Total Requests Sent     : {total_requests}")
    print(f"Successful Requests     : {successful_requests}")
    print(f"Failed Requests         : {failed_requests}")
    print(f"Success Rate            : {(successful_requests / total_requests) * 100:.2f}%")
    print("------------------------------------------------------------")
    print(f"Requests Per Second (RPS): {rps:.2f} req/sec")
    print("------------------------------------------------------------")
    print("Response Times (Latency):")
    print(f"  • Min Response Time   : {min_rt:.2f} ms")
    print(f"  • Average Response Time: {avg_rt:.2f} ms")
    print(f"  • Max Response Time   : {max_rt:.2f} ms")
    print(f"  • 95th Percentile (P95): {p95_rt:.2f} ms")
    print(f"  • 99th Percentile (P99): {p99_rt:.2f} ms")
    print("============================================================\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Baseline / Load Testing Script")
    parser.add_argument("--url", default=DEFAULT_URL, help="Target Base URL (default: http://127.0.0.1:5000)")
    parser.add_argument("--users", type=int, default=DEFAULT_USERS, help="Number of concurrent virtual users (default: 100)")
    parser.add_argument("--duration", type=int, default=DEFAULT_DURATION, help="Test duration in seconds (default: 60)")
    
    args = parser.parse_args()
    run_load_test(args.url, args.users, args.duration)
